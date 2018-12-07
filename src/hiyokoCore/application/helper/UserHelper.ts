import { UserEntity, UserProductEntity } from "../../domain/model/User"
import { IUserRepository } from "../../domain/repository/UserRepository"
import { IDbClient } from "../../interface/infrastructure/db"
import { UserHelperUnauthorizedError } from "../error"
import { IUserProductRelationObject, UserProductRelationComponent } from "../../domain/relation/UserProductRelation"
import { IUserProductRepository } from "../../domain/repository/UserProductRepository"
import { UserRepositoryComponent } from "../../infrastructure/db/UserRepository"
import { applyMixins } from "../../../util/Mixin"
import { UserProductRepositoryComponent } from "../../infrastructure/db/UserProductImplement"

export interface IUserHelper {
  getCurrentUser: () => Promise<UserEntity>
  getCurrentUserProduct: (userEntity: UserEntity) => Promise<UserProductEntity>
}

export class UserHelperComponent implements
  UserRepositoryComponent,
  UserProductRelationComponent,
  UserProductRepositoryComponent
{
  userId: string
  dbc: IDbClient

  userRepository: () => IUserRepository

  userProductRepository: () => IUserProductRepository
  userProductRelation: () => IUserProductRelationObject

  userHelper(): IUserHelper {
    return ({
      getCurrentUser: async (): Promise<UserEntity> => {
        const userEntity = await this.userRepository().userLoader().findByUserId(this.userId)
        if (!userEntity) {
          throw new UserHelperUnauthorizedError(`Unauthorized user action`)
        }
        return userEntity
      },
      getCurrentUserProduct: async (userEntity: UserEntity): Promise<UserProductEntity> => {
        try {
          return await this.userProductRelation().toUserProduct(userEntity)
        } catch (e) {
          return new UserProductEntity(userEntity.userId, 0)
        }
      }
    })
  }
}

applyMixins(
  UserHelperComponent,
  [
    UserRepositoryComponent,
    UserProductRelationComponent,
    UserProductRepositoryComponent
  ]
)