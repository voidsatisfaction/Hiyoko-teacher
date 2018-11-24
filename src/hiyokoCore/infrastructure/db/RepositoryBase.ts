import { IDbClient } from "../../interface/infrastructure/db"

export abstract class RepositoryBase<E> {
  protected readonly dbc: IDbClient

  protected abstract parseAs(data: any[], entityClass: { new(...args: any[]): E }): E[]
}