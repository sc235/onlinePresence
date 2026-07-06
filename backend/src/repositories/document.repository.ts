import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Document, DocumentRelations} from '../models';

export class DocumentRepository extends DefaultCrudRepository<
  Document,
  typeof Document.prototype.id,
  DocumentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Document, dataSource);
  }
}
