import { UserProductEntity } from '../model/User'

export interface IUserProductRepository {
  userProductAction: () => IUserProductAction
  userProductLoader: () => IUserProductLoader
}

export interface IUserProductAction {
  create(userId: string, productId: number): Promise<UserProductEntity>
}

export interface IUserProductLoader {
  findByUserId(userId: string): Promise<UserProductEntity | null>
  findAllByProductId(productId: number): Promise<UserProductEntity[]>
}