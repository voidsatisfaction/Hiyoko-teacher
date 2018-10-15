import { dbClient } from './client'

export abstract class RepositoryBase {
  protected readonly dbc: dbClient
}