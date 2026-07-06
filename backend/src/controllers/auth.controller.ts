import {repository} from '@loopback/repository';
import {
  post,
  get,
  requestBody,
  response,
  Response,
  RestBindings,
  HttpErrors,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {AdminRepository} from '../repositories';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
  ) {}

  @post('/auth/login')
  @response(200, {
    description: 'Admin login',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {type: 'string'},
            token: {type: 'string'},
            admin: {
              type: 'object',
              properties: {
                id: {type: 'number'},
                username: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: {type: 'string'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    credentials: any,
  ): Promise<any> {
    const {username, password} = credentials;

    if (!username || !password) {
      throw new HttpErrors.BadRequest("Nom d'utilisateur et mot de passe requis.");
    }

    const admin = await this.adminRepository.findOne({where: {username}});
    if (!admin) {
      throw new HttpErrors.Unauthorized('Identifiants incorrects.');
    }

    const isValidPassword = bcrypt.compareSync(password, admin.passwordHash);
    if (!isValidPassword) {
      throw new HttpErrors.Unauthorized('Identifiants incorrects.');
    }

    const secret = process.env.JWT_SECRET ?? 'fallback_secret_for_dev_only';
    const token = jwt.sign(
      {id: admin.id, username: admin.username},
      secret,
      {expiresIn: process.env.JWT_EXPIRES_IN ?? '24h'} as any,
    );

    return {
      message: 'Connexion réussie.',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    };
  }

  @get('/auth/verify')
  @response(200, {
    description: 'Verify Admin Token',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            valid: {type: 'boolean'},
            admin: {
              type: 'object',
              properties: {
                id: {type: 'number'},
                username: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async verify(
    @inject(RestBindings.Http.RESPONSE) responseObj: Response,
    @inject('rest.http.request') request: any,
  ): Promise<any> {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpErrors.Unauthorized('Token manquant.');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET ?? 'fallback_secret_for_dev_only';

    try {
      const decoded: any = jwt.verify(token, secret);
      return {
        valid: true,
        admin: {
          id: decoded.id,
          username: decoded.username,
        },
      };
    } catch (err) {
      throw new HttpErrors.Unauthorized('Token invalide ou expiré.');
    }
  }
}
