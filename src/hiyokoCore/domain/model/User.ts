import { DateTime } from "../../../util/DateTime";

export class UserEntity {
  readonly userId: string
  readonly createdAt: DateTime

  constructor(userId: string, createdAt?: DateTime) {
    this.userId = userId
    this.createdAt = createdAt || new DateTime()
  }
}

// TODO: how to extend field
export class UserProductEntity {
  readonly userId: string
  readonly productId: number

  constructor(userId: string, productId: number) {
    this.userId = userId
    this.productId = productId
  }
}