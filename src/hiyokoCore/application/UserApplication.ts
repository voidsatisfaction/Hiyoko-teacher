import { UserEntity } from "../domain/model/User";
import { UserRepository } from "../infrastructure/db/UserRepository";
import { IUserBootstrap, IUserLoader } from "../domain/repository/User";
import { applyMixins } from "../../util/Mixin";
import { DbClientComponent, DbClient } from "../infrastructure/db/client";

export class UserApplication
  implements UserRepository, DbClientComponent {

  readonly dbc: DbClient
  private userId: string

  dbClient: () => DbClient

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
  [UserRepository, DbClientComponent]
)
