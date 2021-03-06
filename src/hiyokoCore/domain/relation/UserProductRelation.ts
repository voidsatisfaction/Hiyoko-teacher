import { UserEntity, UserProductEntity } from '../model/User';
import { IDbClient } from '../../interface/infrastructure/db';
import { IUserProductRepository } from '../repository/UserProductRepository';

export interface IUserProductRelationObject {
  toUserProducts(users: UserEntity[]): Promise<UserProductEntity[]>
  toUserProduct(user: UserEntity): Promise<UserProductEntity>
}

export class UserProductRelationComponent {
  // self type annotation
  userProductRepository: () => IUserProductRepository
  dbc: IDbClient

  // return singleton object
  userProductRelation(): IUserProductRelationObject {
    return ({
      toUserProducts: async (users: UserEntity[]): Promise<UserProductEntity[]> => {
        return Promise.all(
          users.map(user => this.userProductRepository().userProductLoader().findByUserId(user.userId))
        )
      },
      toUserProduct: async (user: UserEntity): Promise<UserProductEntity> => {
        return await this.userProductRepository().userProductLoader().findByUserId(user.userId)
      }
    })
  }
}
