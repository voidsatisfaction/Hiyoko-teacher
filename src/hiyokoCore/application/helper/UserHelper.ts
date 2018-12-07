import { UserEntity, UserProductEntity } from "../../domain/model/User"
import { IUserRepository } from "../../domain/repository/UserRepository"
import { applyMixins } from "../../../util/Mixin"
import { UserRepositoryComponent } from "../../infrastructure/db/UserRepository"
import { IDbClient } from "../../interface/infrastructure/db"
import { UserHelperUnauthorizedError } from "../error"
import { UserProductRepositoryComponent } from "../../infrastructure/db/UserProductImplement"
import { UserProductRelationComponent, IUserProductRelationObject } from "../../domain/relation/UserProductRelation"
import { IUserProductRepository } from "../../domain/repository/UserProductRepository"

export class UserHelperComponent
  implements UserRepositoryComponent,
  UserProductRepositoryComponent,
  UserProductRelationComponent
  {

  userId: string
  dbc: IDbClient

  userRepository: () => IUserRepository

  userProductRepository: () => IUserProductRepository
  userProductRelation: () => IUserProductRelationObject

  async getCurrentUser(): Promise<UserEntity> {
    const userEntity = await this.userRepository().userLoader().findByUserId(this.userId)
    if (!userEntity) {
      throw new UserHelperUnauthorizedError(`Unauthorized user action`)
    }
    return userEntity
  }

  async getCurrentUserProduct(userEntity: UserEntity): Promise<UserProductEntity | 0> {
    try {
      return await this.userProductRelation().toUserProduct(userEntity)
    } catch(e) {
      return new UserProductEntity(userEntity.userId, 0)
    }
  }
}

applyMixins(
  UserHelperComponent,
  [
    UserRepositoryComponent,
    UserProductRepositoryComponent,
    UserProductRelationComponent
  ]
)