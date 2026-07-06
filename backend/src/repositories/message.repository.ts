import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Message, MessageRelations, Document} from '../models';
import {DocumentRepository} from './document.repository';

export class MessageRepository extends DefaultCrudRepository<
  Message,
  typeof Message.prototype.id,
  MessageRelations
> {
  public readonly documents: HasManyRepositoryFactory<Document, typeof Message.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('DocumentRepository') protected documentRepositoryGetter: Getter<DocumentRepository>,
  ) {
    super(Message, dataSource);
    this.documents = this.createHasManyRepositoryFactoryFor('documents', documentRepositoryGetter);
    this.registerInclusionResolver('documents', this.documents.inclusionResolver);
  }
}
