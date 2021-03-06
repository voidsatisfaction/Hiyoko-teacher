import { UserEntity, UserProductEntity } from "../domain/model/User"
import { UserRepositoryComponent } from "../infrastructure/db/UserRepository"
import { IUserRepository } from "../domain/repository/UserRepository"
import { applyMixins } from "../../util/Mixin"
import { DbClientComponent } from "../infrastructure/db/client"
import { IDbClient } from "../interface/infrastructure/db"
import { UserActionLogHelperComponent, IUserActionLoggerObject, Action } from "./helper/UserActionLogHelper";
import { LoggerDBClientComponent } from "../infrastructure/loggerDb/client";
import { ILoggerDBClient } from "../interface/infrastructure/LoggerDB";
import { IUserProductRelationObject, UserProductRelationComponent } from "../domain/relation/UserProductRelation";
import { UserProductRepositoryComponent } from "../infrastructure/db/UserProductImplement";
import { IUserProductRepository } from "../domain/repository/UserProductRepository";

export class UserApplication
  implements DbClientComponent,
    LoggerDBClientComponent,
    UserRepositoryComponent,
    UserProductRepositoryComponent,
    UserProductRelationComponent,
    UserActionLogHelperComponent
  {

  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient
  readonly userId: string

  dbClient: () => IDbClient
  loggerDBClient: () => ILoggerDBClient

  userRepository: () => IUserRepository

  userProductRepository: () => IUserProductRepository
  userProductRelation: () => IUserProductRelationObject

  userActionLogger: () => IUserActionLoggerObject

  constructor(userId: string) {
    this.dbc = this.dbClient()
    this.loggerDBC = this.loggerDBClient()
    this.userId = userId
  }

  async getOrAdd(productId: number): Promise<UserEntity> {
    try {
      const userBootstrap = this.userRepository().userBootstrap()

      const user = await userBootstrap.findOrCreate(this.userId)

      await this.userProductRepository().userProductAction().create(user.userId, productId)

      this.userActionLogger().putActionLog(
        Action.follow, productId
      )

      return user
    } catch(e) {
      throw e
    }
  }

  async adminListAll(): Promise<UserProductEntity[]> {
    try {
      const userLoader = this.userRepository().userLoader()

      // TODO: all user meta data
      const userEntities = await userLoader.listAll()

      const userProducts = await this.userProductRelation().toUserProducts(userEntities)

      return userProducts
    } catch(e) {
      throw e
    }
  }
}

applyMixins(
  UserApplication,
  [
    DbClientComponent,
    LoggerDBClientComponent,
    UserRepositoryComponent,
    UserProductRepositoryComponent,
    UserProductRelationComponent,
    UserActionLogHelperComponent
  ]
)
