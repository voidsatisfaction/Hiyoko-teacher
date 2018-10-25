import { DbClient } from './client'

export abstract class RepositoryBase<E> {
  protected readonly dbc: DbClient

  protected abstract parseAs(data: any[], entityClass: { new(...args: any[]): E }): E[]
}