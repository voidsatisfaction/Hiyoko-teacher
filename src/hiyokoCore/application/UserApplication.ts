import { UserEntity } from "../domain/model/User"
import { UserRepository } from "../infrastructure/db/UserRepository"
import { IUserBootstrap, IUserLoader } from "../domain/repository/UserRepository"
import { applyMixins } from "../../util/Mixin"
import { DbClientComponent } from "../infrastructure/db/client"
import { IDbClient } from "../interface/infrastructure/db"
import { UserActionLogHelperComponent, IUserActionLoggerObject, Action } from "./helper/UserActionLogHelper";
import { LoggerDBClientComponent } from "../infrastructure/loggerDb/client";
import { ILoggerDBClient } from "../interface/infrastructure/LoggerDB";

export class UserApplication
  implements DbClientComponent,
    LoggerDBClientComponent,
    UserRepository,
    UserActionLogHelperComponent
  {

  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient
  readonly userId: string

  dbClient: () => IDbClient
  loggerDBClient: () => ILoggerDBClient

  userBootstrap: () => IUserBootstrap
  userLoader: () => IUserLoader

  userActionLogger: () => IUserActionLoggerObject

  constructor(userId: string) {
    this.dbc = this.dbClient()
    this.loggerDBC = this.loggerDBClient()
    this.userId = userId
  }

  async getOrAdd(): Promise<UserEntity> {
    try {
      const userBootstrap = this.userBootstrap()

      this.userActionLogger().putActionLog(
        Action.follow, 1
      )

      return await userBootstrap.findOrCreate(this.userId)
    } catch(e) {
      throw e
    } finally {
      await this.dbc.close()
    }
  }

  async adminListAll(): Promise<UserEntity[]> {
    try {
      const userLoader = this.userLoader()

      // TODO: all user meta data
      const userEntities = await userLoader.listAll()

      return userEntities
    } catch(e) {
      throw e
    } finally {
      await this.dbc.close()
    }
  }
}

applyMixins(
  UserApplication,
  [
    DbClientComponent,
    LoggerDBClientComponent,
    UserRepository,
    UserActionLogHelperComponent
  ]
)
