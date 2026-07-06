import {repository} from '@loopback/repository';
import {
  post,
  get,
  patch,
  del,
  param,
  requestBody,
  response,
  RestBindings,
  HttpErrors,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {MessageRepository, DocumentRepository} from '../repositories';
import {Message} from '../models';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

let transporter: any = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📧 Compte email de test Ethereal créé :', testAccount.user);
    } catch (err: any) {
      console.warn('⚠️ Impossible de créer un compte Ethereal. Les emails ne seront pas envoyés.');
      return null;
    }
  }

  return transporter;
}

export class ContactController {
  constructor(
    @repository(MessageRepository)
    public messageRepository: MessageRepository,
    @repository(DocumentRepository)
    public documentRepository: DocumentRepository,
    @inject(RestBindings.Http.REQUEST)
    private request: any,
  ) {}

  private checkAuth() {
    const authHeader = this.request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpErrors.Unauthorized('Token manquant.');
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET ?? 'fallback_secret_for_dev_only';
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw new HttpErrors.Unauthorized('Token invalide ou expiré.');
    }
  }

  @post('/contacts')
  @response(201, {
    description: 'Envoi message contact',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async create(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['nom', 'email', 'message'],
            properties: {
              nom: {type: 'string'},
              email: {type: 'string'},
              telephone: {type: 'string'},
              sujet: {type: 'string'},
              message: {type: 'string'},
              rdv_date: {type: 'string'},
            },
          },
        },
      },
    })
    body: any,
  ): Promise<any> {
    const {nom, email, telephone, sujet, message, rdv_date} = body;

    if (!nom || !email || !message) {
      throw new HttpErrors.BadRequest("Les champs nom, email et message sont obligatoires.");
    }

    const isRdv = sujet === 'Demande de rendez-vous' || !!rdv_date;
    const dateRdv = isRdv ? (rdv_date || null) : null;
    const statutRdv = isRdv ? 'en_attente' : null;

    const createdMessage = await this.messageRepository.create({
      nom,
      email,
      telephone: telephone || undefined,
      sujet: sujet || undefined,
      message,
      rdvDate: dateRdv ?? undefined,
      rdvStatut: statutRdv ?? undefined,
      statut: 'nouveau',
    });

    // Envoyer les emails en arrière-plan
    (async () => {
      try {
        const mailer = await getTransporter();
        if (mailer) {
          await mailer.sendMail({
            from: `"Cabinet Maître Ndiaye" <${process.env.SMTP_FROM ?? 'contact@cabinet-ndiaye.sn'}>`,
            to: process.env.SMTP_FROM ?? 'contact@cabinet-ndiaye.sn',
            subject: `📩 Nouveau message de ${nom} — ${sujet ?? 'Contact'}`,
            html: `
              <h2>Nouveau message reçu</h2>
              <table style="border-collapse: collapse; width: 100%;">
                <tr><td style="padding: 8px; font-weight: bold;">Nom :</td><td style="padding: 8px;">${nom}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Email :</td><td style="padding: 8px;">${email}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Téléphone :</td><td style="padding: 8px;">${telephone || 'Non renseigné'}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Sujet :</td><td style="padding: 8px;">${sujet || 'Non renseigné'}</td></tr>
              </table>
              <h3>Message :</h3>
              <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${message}</p>
            `,
          });

          await mailer.sendMail({
            from: `"Cabinet Maître Ndiaye" <${process.env.SMTP_FROM ?? 'contact@cabinet-ndiaye.sn'}>`,
            to: email,
            subject: 'Confirmation de réception — Cabinet Maître Ndiaye',
            html: `
              <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #0c1b33; padding: 24px; text-align: center;">
                  <h1 style="color: #c9a84c; margin: 0;">Cabinet Maître Ndiaye</h1>
                </div>
                <div style="padding: 32px; background: #ffffff;">
                  <p>Cher(e) <strong>${nom}</strong>,</p>
                  <p>Nous avons bien reçu votre message et vous en remercions.</p>
                  <p>Notre équipe examinera votre demande dans les plus brefs délais et vous recontactera sous 24 à 48 heures.</p>
                  <p>Cordialement,</p>
                  <p><strong>Cabinet Maître Cheikh Ahmadou Ndiaye</strong><br>
                  13 bis place de l'indépendance, Dakar<br>
                  +221 77 630 37 03</p>
                </div>
                <div style="background: #152238; padding: 16px; text-align: center; color: #888; font-size: 12px;">
                  <p>© ${new Date().getFullYear()} Cabinet Maître Ndiaye — Tous droits réservés</p>
                </div>
              </div>
            `,
          });
        }
      } catch (emailErr: any) {
        console.error('⚠️ Erreur envoi email en arrière-plan:', emailErr.message);
      }
    })();

    return {
      message: isRdv
        ? 'Votre demande de rendez-vous a été envoyée avec succès. Vous recevrez une confirmation par email dès validation par le cabinet.'
        : 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
      id: createdMessage.id,
    };
  }

  @get('/contacts')
  async find(
    @param.query.string('statut') statut?: string,
    @param.query.number('page') page: number = 1,
    @param.query.number('limit') limit: number = 20,
  ): Promise<any> {
    this.checkAuth();

    const offset = (page - 1) * limit;
    const filter: any = {};
    if (statut) {
      filter.statut = statut;
    }

    const total = await this.messageRepository.count(filter);
    const messages = await this.messageRepository.find({
      where: filter,
      order: ['dateCreation DESC'],
      limit,
      offset,
    });

    return {
      messages,
      pagination: {
        total: total.count,
        page,
        limit,
        totalPages: Math.ceil(total.count / limit),
      },
    };
  }

  @get('/contacts/stats')
  async stats(): Promise<any> {
    this.checkAuth();

    const total = await this.messageRepository.count();
    const nouveau = await this.messageRepository.count({statut: 'nouveau'});
    const lu = await this.messageRepository.count({statut: 'lu'});
    const traite = await this.messageRepository.count({statut: 'traité'});
    const totalDocs = await this.documentRepository.count();

    return {
      total: total.count,
      nouveau: nouveau.count,
      lu: lu.count,
      traite: traite.count,
      totalDocs: totalDocs.count,
    };
  }

  @get('/contacts/{id}')
  async findById(@param.path.number('id') id: number): Promise<any> {
    this.checkAuth();

    const message = await this.messageRepository.findById(id);
    const documents = await this.messageRepository.documents(id).find();

    // Map properties to match original SQLite layout for React frontend compatibility
    return {
      ...message,
      documents: documents.map(d => ({
        id: d.id,
        message_id: d.messageId,
        nom_fichier: d.nomFichier,
        chemin_fichier: d.cheminFichier,
        type: d.type,
        taille: d.taille,
        date_upload: d.dateUpload,
      })),
    };
  }

  @patch('/contacts/{id}/status')
  async updateStatus(
    @param.path.number('id') id: number,
    @requestBody() body: {statut: string},
  ): Promise<any> {
    this.checkAuth();

    const {statut} = body;
    const validStatuts = ['nouveau', 'lu', 'traité'];

    if (!statut || !validStatuts.includes(statut)) {
      throw new HttpErrors.BadRequest('Statut invalide. Valeurs acceptées : nouveau, lu, traité.');
    }

    await this.messageRepository.updateById(id, {statut});
    return {message: 'Statut mis à jour avec succès.'};
  }

  @patch('/contacts/{id}/rdv')
  async updateRdv(
    @param.path.number('id') id: number,
    @requestBody() body: {statut: string; heure?: string},
  ): Promise<any> {
    this.checkAuth();

    const {statut, heure} = body;
    const validStatuts = ['accepté', 'refusé'];

    if (!statut || !validStatuts.includes(statut)) {
      throw new HttpErrors.BadRequest('Statut invalide. Valeurs acceptées : accepté, refusé.');
    }

    if (statut === 'accepté' && !heure) {
      throw new HttpErrors.BadRequest("L'heure de rendez-vous est requise pour une confirmation.");
    }

    const message = await this.messageRepository.findById(id);
    const rdvHeure = statut === 'accepté' ? heure : undefined;

    await this.messageRepository.updateById(id, {
      rdvStatut: statut,
      rdvHeure,
      statut: 'traité',
    });

    // Envoyer l'email en arrière-plan
    (async () => {
      try {
        const mailer = await getTransporter();
        if (mailer) {
          const dateFormatted = message.rdvDate
            ? new Date(message.rdvDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long',
              })
            : 'Date non précisée';

          let emailSubject = '';
          let emailHtml = '';

          if (statut === 'accepté') {
            emailSubject = 'Confirmation de votre rendez-vous — Cabinet Maître Ndiaye';
            emailHtml = `
              <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; border: 1px solid #c9a84c;">
                <div style="background: #0c1b33; padding: 24px; text-align: center;">
                  <h1 style="color: #c9a84c; margin: 0;">Cabinet Maître Ndiaye</h1>
                </div>
                <div style="padding: 32px; background: #ffffff; color: #152238; line-height: 1.6;">
                  <p>Cher(e) <strong>${message.nom}</strong>,</p>
                  <p>Nous avons le plaisir de vous informer que votre demande de rendez-vous a été <strong>confirmée</strong>.</p>
                  <div style="background: #fcf9f2; border-left: 4px solid #c9a84c; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; font-weight: bold; color: #0c1b33;">Détails du rendez-vous :</p>
                    <p style="margin: 8px 0 0 0;">📅 <strong>Date :</strong> ${dateFormatted}</p>
                    <p style="margin: 4px 0 0 0;">⏰ <strong>Heure :</strong> ${heure}</p>
                    <p style="margin: 4px 0 0 0;">📍 <strong>Lieu :</strong> 13 bis place de l'indépendance, Dakar</p>
                  </div>
                  <p>Si vous avez un empêchement, merci de nous en informer au moins 24 heures à l'avance au <strong>+221 77 630 37 03</strong>.</p>
                  <p>Cordialement,</p>
                  <p><strong>Cabinet Maître Cheikh Ahmadou Ndiaye</strong><br>
                  13 bis place de l'indépendance, Dakar<br>
                  +221 77 630 37 03</p>
                </div>
                <div style="background: #152238; padding: 16px; text-align: center; color: #888; font-size: 12px;">
                  <p>© ${new Date().getFullYear()} Cabinet Maître Ndiaye — Tous droits réservés</p>
                </div>
              </div>
            `;
          } else {
            emailSubject = 'Votre demande de rendez-vous — Cabinet Maître Ndiaye';
            emailHtml = `
              <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; border: 1px solid #c9a84c;">
                <div style="background: #0c1b33; padding: 24px; text-align: center;">
                  <h1 style="color: #c9a84c; margin: 0;">Cabinet Maître Ndiaye</h1>
                </div>
                <div style="padding: 32px; background: #ffffff; color: #152238; line-height: 1.6;">
                  <p>Cher(e) <strong>${message.nom}</strong>,</p>
                  <p>Nous vous remercions pour l'intérêt que vous portez à notre cabinet.</p>
                  <p>Malheureusement, en raison d'un calendrier extrêmement chargé, nous ne pourrons pas honorer votre demande de rendez-vous pour le <strong>${dateFormatted}</strong>.</p>
                  <p>Nous vous invitons à nous contacter directement par téléphone au <strong>+221 77 630 37 03</strong> ou à proposer un autre créneau afin de trouver une date convenable.</p>
                  <p>Nous vous remercions pour votre compréhension.</p>
                  <p>Cordialement,</p>
                  <p><strong>Cabinet Maître Cheikh Ahmadou Ndiaye</strong><br>
                  13 bis place de l'indépendance, Dakar<br>
                  +221 77 630 37 03</p>
                </div>
                <div style="background: #152238; padding: 16px; text-align: center; color: #888; font-size: 12px;">
                  <p>© ${new Date().getFullYear()} Cabinet Maître Ndiaye — Tous droits réservés</p>
                </div>
              </div>
            `;
          }

          await mailer.sendMail({
            from: `"Cabinet Maître Ndiaye" <${process.env.SMTP_FROM ?? 'contact@cabinet-ndiaye.sn'}>`,
            to: message.email,
            subject: emailSubject,
            html: emailHtml,
          });
        }
      } catch (emailErr: any) {
        console.error('⚠️ Erreur envoi email notification RDV:', emailErr.message);
      }
    })();

    return {
      message: `Rendez-vous ${statut} avec succès.`,
      statut,
      heure: rdvHeure,
    };
  }

  @del('/contacts/{id}')
  async deleteById(@param.path.number('id') id: number): Promise<any> {
    this.checkAuth();

    await this.messageRepository.deleteById(id);
    return {message: 'Message supprimé avec succès.'};
  }
}
