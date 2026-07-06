import {Entity, model, property, hasMany} from '@loopback/repository';
import {Document} from './document.model';

@model({
  name: 'messages',
  settings: {
    postgresql: {table: 'messages'},
  },
})
export class Message extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {columnName: 'id', dataType: 'integer'},
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'nom', dataType: 'text'},
  })
  nom: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'email', dataType: 'text'},
  })
  email: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'telephone', dataType: 'text'},
  })
  telephone?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'sujet', dataType: 'text'},
  })
  sujet?: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'message', dataType: 'text'},
  })
  message: string;

  @property({
    type: 'string',
    default: 'nouveau',
    postgresql: {columnName: 'statut', dataType: 'text'},
  })
  statut?: string;

  @property({
    type: 'date',
    postgresql: {columnName: 'date_creation', dataType: 'timestamp with time zone', dbDefault: 'now()'},
  })
  dateCreation?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'rdv_date', dataType: 'text'},
  })
  rdvDate?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'rdv_heure', dataType: 'text'},
  })
  rdvHeure?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'rdv_statut', dataType: 'text'},
  })
  rdvStatut?: string;

  @hasMany(() => Document, {keyTo: 'messageId'})
  documents?: Document[];

  constructor(data?: Partial<Message>) {
    super(data);
  }
}

export interface MessageRelations {
  // Describe relations here
}

export type MessageWithRelations = Message & MessageRelations;
