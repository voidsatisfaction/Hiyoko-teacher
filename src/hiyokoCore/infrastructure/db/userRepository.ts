import { dbClient } from './client'
import { RepositoryBase } from './RepositoryBase'

import { IUserRepository } from '../../domain/repository/User'

import { UserEntity } from '../../domain/model/User';

export class UserRepository extends RepositoryBase<UserEntity> implements IUserRepository {
  protected readonly dbc: dbClient

  constructor(dbClient: dbClient) {
    super()
    this.dbc = dbClient
  }

  protected parseAs(
    data: any[],
    UserEntityClass: { new(...args: any[]): UserEntity }
  ): UserEntity[] {
    return data.map(d => new UserEntityClass(d.userId, d.userCreatedAt))
  }

  async findOrCreate(userId: string): Promise<UserEntity> {
    const res = await this.dbc.User.findOrCreate({
      where: {
        userId
      }
    }).spread((data) => [data])

    return this.parseAs(res.map(d => d.dataValues), UserEntity)[0]
  }

  async listAll(): Promise<UserEntity[]> {
    const res = await this.dbc.User.findAll()

    return this.parseAs(res.map(d => d.dataValues), UserEntity)
  }

  async findByUserId(userId: string): Promise<UserEntity | null> {
    const res = await this.dbc.User.findById(userId)

    if (!res) {
      return null
    }

    return this.parseAs([ res.dataValues ], UserEntity)[0]
  }
}