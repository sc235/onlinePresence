import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Message} from './message.model';

@model({
  name: 'documents',
  settings: {
    postgresql: {table: 'documents'},
  },
})
export class Document extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {columnName: 'id', dataType: 'integer'},
  })
  id?: number;

  @belongsTo(
    () => Message,
    {keyFrom: 'messageId'},
    {
      postgresql: {columnName: 'message_id', dataType: 'integer'},
    }
  )
  messageId?: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'nom_fichier', dataType: 'text'},
  })
  nomFichier: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'chemin_fichier', dataType: 'text'},
  })
  cheminFichier: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'type', dataType: 'text'},
  })
  type?: string;

  @property({
    type: 'number',
    postgresql: {columnName: 'taille', dataType: 'integer'},
  })
  taille?: number;

  @property({
    type: 'date',
    postgresql: {columnName: 'date_upload', dataType: 'timestamp with time zone', dbDefault: 'now()'},
  })
  dateUpload?: string;

  constructor(data?: Partial<Document>) {
    super(data);
  }
}

export interface DocumentRelations {
  // Describe relations here
}

export type DocumentWithRelations = Document & DocumentRelations;
