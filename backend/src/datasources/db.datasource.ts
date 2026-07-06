import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import dotenv from 'dotenv';
import path from 'path';

// Load environmental variables from .env
dotenv.config({path: path.join(__dirname, '../../.env')});

const config = {
  name: 'db',
  connector: 'postgresql',
  url: '',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: +(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'cabinet_avocat',
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
