import { dbClient } from './client'

export abstract class RepositoryBase<E> {
  protected readonly dbc: dbClient

  protected abstract parseAs(data: any[], entityClass: { new(...args: any[]): E }): E[]
}