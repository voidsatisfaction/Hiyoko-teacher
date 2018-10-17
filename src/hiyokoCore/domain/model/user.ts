export class UserEntity {
  readonly userId: string
  readonly createdAt: Date

  constructor(userId: string, createdAt?: Date) {
    this.userId = userId
    this.createdAt = createdAt || new Date()
  }
}