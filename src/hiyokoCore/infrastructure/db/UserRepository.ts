import { DbClient } from './client'
import { RepositoryBase } from './RepositoryBase'
import { IUserRepository, IUserBootstrap, IUserLoader } from '../../domain/repository/User'
import { UserEntity } from '../../domain/model/User'

export class UserRepository implements IUserRepository {
  readonly dbc: DbClient

  constructor(DbClient: DbClient) {
    this.dbc = DbClient
  }

  userBootstrap(): IUserBootstrap {
    return new UserDB(this.dbc)
  }

  userLoader(): IUserLoader {
    return new UserDB(this.dbc)
  }
}

class UserDB extends RepositoryBase<UserEntity> implements IUserBootstrap, IUserLoader {
  readonly dbc: DbClient

  constructor(dbc: DbClient) {
    super()
    this.dbc = dbc
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

    return this.parseAs([res.dataValues], UserEntity)[0]
  }
}