import { IDbClient } from './client'

export abstract class RepositoryBase<E> {
  protected readonly dbc: IDbClient

  protected abstract parseAs(data: any[], entityClass: { new(...args: any[]): E }): E[]
}