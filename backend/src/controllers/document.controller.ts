import {repository} from '@loopback/repository';
import {
  post,
  get,
  del,
  param,
  requestBody,
  response,
  RestBindings,
  HttpErrors,
  Response,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {DocumentRepository} from '../repositories';
import {Document} from '../models';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../../uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: {fileSize: MAX_FILE_SIZE},
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Types acceptés : PDF, DOC, DOCX, JPG, PNG, WEBP.'));
    }
  },
});

export class DocumentController {
  constructor(
    @repository(DocumentRepository)
    public documentRepository: DocumentRepository,
    @inject(RestBindings.Http.REQUEST)
    private request: any,
    @inject(RestBindings.Http.RESPONSE)
    private responseObj: Response,
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

  @post('/documents')
  @response(201, {
    description: 'Upload files (admin)',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async uploadMultiple(): Promise<any> {
    this.checkAuth();

    return new Promise((resolve, reject) => {
      upload.array('files', 5)(this.request, this.responseObj, async (err: any) => {
        if (err) {
          return reject(new HttpErrors.BadRequest(err.message));
        }

        const files = this.request.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          return reject(new HttpErrors.BadRequest('Aucun fichier reçu.'));
        }

        try {
          const messageId = this.request.body.message_id ? parseInt(this.request.body.message_id) : undefined;
          const documents: Document[] = [];

          for (const file of files) {
            const doc = await this.documentRepository.create({
              messageId,
              nomFichier: file.originalname,
              cheminFichier: file.filename,
              type: file.mimetype,
              taille: file.size,
            });
            documents.push(doc);
          }

          resolve({
            message: `${documents.length} fichier(s) uploadé(s) avec succès.`,
            documents: documents.map(d => ({
              id: d.id,
              message_id: d.messageId,
              nom_fichier: d.nomFichier,
              chemin_fichier: d.cheminFichier,
              type: d.type,
              taille: d.taille,
              date_upload: d.dateUpload,
            })),
          });
        } catch (dbErr) {
          reject(new HttpErrors.InternalServerError('Erreur lors de l\'enregistrement en base de données.'));
        }
      });
    });
  }

  @post('/documents/public')
  @response(201, {
    description: 'Upload file (public)',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async uploadSingle(): Promise<any> {
    return new Promise((resolve, reject) => {
      upload.single('file')(this.request, this.responseObj, async (err: any) => {
        if (err) {
          return reject(new HttpErrors.BadRequest(err.message));
        }

        const file = this.request.file as Express.Multer.File;
        if (!file) {
          return reject(new HttpErrors.BadRequest('Aucun fichier reçu.'));
        }

        try {
          const messageId = this.request.body.message_id ? parseInt(this.request.body.message_id) : undefined;

          const doc = await this.documentRepository.create({
            messageId,
            nomFichier: file.originalname,
            cheminFichier: file.filename,
            type: file.mimetype,
            taille: file.size,
          });

          resolve({
            message: 'Fichier uploadé avec succès.',
            document: {
              id: doc.id,
              message_id: doc.messageId,
              nom_fichier: doc.nomFichier,
              chemin_fichier: doc.cheminFichier,
              type: doc.type,
              taille: doc.taille,
              date_upload: doc.dateUpload,
            },
          });
        } catch (dbErr) {
          reject(new HttpErrors.InternalServerError('Erreur lors de l\'enregistrement en base de données.'));
        }
      });
    });
  }

  @get('/documents')
  async find(
    @param.query.number('page') page: number = 1,
    @param.query.number('limit') limit: number = 20,
  ): Promise<any> {
    this.checkAuth();

    const offset = (page - 1) * limit;
    const total = await this.documentRepository.count();

    // In LoopBack, we can execute native queries or use relation queries.
    // For simplicity, let's fetch documents and left-join or map contact names.
    const documents = await this.documentRepository.find({
      order: ['dateUpload DESC'],
      limit,
      offset,
    });

    // Resolve contact_nom for dashboard compat
    const ds = await this.documentRepository.dataSource;
    const sql = `
      SELECT d.*, m.nom as contact_nom 
      FROM documents d 
      LEFT JOIN messages m ON d.message_id = m.id 
      ORDER BY d.date_upload DESC 
      LIMIT $1 OFFSET $2
    `;
    const results = await ds.execute(sql, [limit, offset]);

    // Map keys to match the frontend expectations
    const mapped = results.map((r: any) => ({
      id: r.id,
      message_id: r.message_id,
      nom_fichier: r.nom_fichier,
      chemin_fichier: r.chemin_fichier,
      type: r.type,
      taille: r.taille,
      date_upload: r.date_upload,
      contact_nom: r.contact_nom,
    }));

    return {
      documents: mapped,
      pagination: {
        total: total.count,
        page,
        limit,
        totalPages: Math.ceil(total.count / limit),
      },
    };
  }

  @get('/documents/{id}/download')
  async download(@param.path.number('id') id: number): Promise<any> {
    this.checkAuth();

    const doc = await this.documentRepository.findById(id);
    const filePath = path.join(__dirname, '../../../uploads', doc.cheminFichier);

    if (!fs.existsSync(filePath)) {
      throw new HttpErrors.NotFound('Fichier non trouvé sur le serveur.');
    }

    this.responseObj.download(filePath, doc.nomFichier);
    return this.responseObj;
  }

  @del('/documents/{id}')
  async deleteById(@param.path.number('id') id: number): Promise<any> {
    this.checkAuth();

    const doc = await this.documentRepository.findById(id);

    const filePath = path.join(__dirname, '../../../uploads', doc.cheminFichier);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.documentRepository.deleteById(id);
    return {message: 'Document supprimé avec succès.'};
  }
}
