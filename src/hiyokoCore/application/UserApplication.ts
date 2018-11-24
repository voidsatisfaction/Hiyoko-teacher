import { UserEntity } from "../domain/model/User";
import { UserRepository } from "../infrastructure/db/UserRepository";
import { IUserBootstrap, IUserLoader } from "../domain/repository/User";
import { applyMixins } from "../../util/Mixin";
import { DbClientComponent, IDbClient } from "../infrastructure/db/client";
import { UserHelperComponent } from "./helper/UserHelper";

export class UserApplication
  implements DbClientComponent, UserHelperComponent, UserRepository {

  readonly dbc: IDbClient
  private userId: string

  dbClient: () => IDbClient

  userBootstrap: () => IUserBootstrap
  userLoader: () => IUserLoader
  getCurrentUser: (userId: string) => Promise<UserEntity>

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
  [DbClientComponent, UserHelperComponent, UserRepository]
)
