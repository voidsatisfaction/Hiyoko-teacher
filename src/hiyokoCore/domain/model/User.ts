export class UserEntity {
  readonly userId: string
  readonly createdAt: Date

  constructor(userId: string, createdAt?: Date) {
    this.userId = userId
    this.createdAt = createdAt || new Date()
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