import { UserEntity } from "../domain/model/User"
import { UserRepository } from "../infrastructure/db/UserRepository"
import { IUserBootstrap, IUserLoader } from "../domain/repository/UserRepository"
import { applyMixins } from "../../util/Mixin"
import { DbClientComponent } from "../infrastructure/db/client"
import { IDbClient } from "../interface/infrastructure/db"

export class UserApplication
  implements DbClientComponent, UserRepository {

  readonly dbc: IDbClient
  private userId: string

  dbClient: () => IDbClient

  userBootstrap: () => IUserBootstrap
  userLoader: () => IUserLoader

  constructor(userId: string) {
    this.dbc = this.dbClient()
    this.userId = userId
  }

  async getOrAdd(): Promise<UserEntity> {
    try {
      const userBootstrap = this.userBootstrap()

      return await userBootstrap.findOrCreate(this.userId)
    } catch(e) {
      throw e
    } finally {
      await this.dbc.close()
    }
  }
}

applyMixins(
  UserApplication,
  [DbClientComponent, UserRepository]
)
