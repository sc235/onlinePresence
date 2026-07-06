import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'admins',
  settings: {
    postgresql: {table: 'admins'},
  },
})
export class Admin extends Entity {
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
    postgresql: {columnName: 'username', dataType: 'text'},
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'password_hash', dataType: 'text'},
  })
  passwordHash: string;

  @property({
    type: 'date',
    postgresql: {columnName: 'created_at', dataType: 'timestamp with time zone', dbDefault: 'now()'},
  })
  createdAt?: string;

  constructor(data?: Partial<Admin>) {
    super(data);
  }
}

export interface AdminRelations {
  // Describe relations here
}

export type AdminWithRelations = Admin & AdminRelations;
