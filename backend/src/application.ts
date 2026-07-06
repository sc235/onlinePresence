import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import path from 'path';
import fs from 'fs';

// Import our components manually
import {DbDataSource} from './datasources';
import {AdminRepository, MessageRepository, DocumentRepository} from './repositories';
import {AuthController, ContactController, DocumentController} from './controllers';

export {ApplicationConfig};

export class CabinetAvocatBackendApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    // Configure REST server options
    options.rest = options.rest ?? {};
    options.rest.basePath = '/api';
    options.rest.cors = {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Dynamically allow any origin calling the API to prevent CORS blocks
        callback(null, true);
      },
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization,X-Requested-With,Accept',
    };

    super(options);

    this.projectRoot = __dirname;

    // Manually bind datasource
    this.dataSource(DbDataSource);

    // Manually bind repositories
    this.repository(AdminRepository);
    this.repository(MessageRepository);
    this.repository(DocumentRepository);

    // Manually bind controllers
    this.controller(AuthController);
    this.controller(ContactController);
    this.controller(DocumentController);

    // Set up the static directory for file uploads
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, {recursive: true});
      console.log('📁 Dossier uploads/ créé.');
    }
    this.static('/uploads', uploadsDir);

    // Set up Rest Explorer
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Register health check endpoint
    this.restServer.route('get', '/health', {
      'x-visibility': 'undocumented',
      responses: {
        '200': {
          description: 'Health Check',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {type: 'string'},
                  timestamp: {type: 'string'},
                },
              },
            },
          },
        },
      },
    }, async () => {
      return {status: 'OK', timestamp: new Date().toISOString()};
    });
  }
}
