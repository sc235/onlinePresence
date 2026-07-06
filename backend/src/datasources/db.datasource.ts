import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import dotenv from 'dotenv';
import path from 'path';

// Load environmental variables from .env
dotenv.config({path: path.join(__dirname, '../../.env')});

const config = {
  name: 'db',
  connector: 'postgresql',
  url: process.env.DATABASE_URL ?? '',
  host: process.env.DB_HOST ?? process.env.PGHOST ?? '127.0.0.1',
  port: +(process.env.DB_PORT ?? process.env.PGPORT ?? 5432),
  user: process.env.DB_USER ?? process.env.PGUSER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? process.env.PGPASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? process.env.PGDATABASE ?? 'rdv',
};

// Observe application life cycle to be notified when database connects/disconnects
@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'db';
  static defaultMimeType = 'application/json';

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
