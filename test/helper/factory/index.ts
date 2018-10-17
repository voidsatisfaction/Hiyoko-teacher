import { UserEntity } from '../../../src/hiyokoCore/domain/model/user'
import { Random } from '../util';

export const UserEntityMock = (userId?: string, createdAt?: Date): UserEntity => {
  userId = userId || Random.alphaNumeric(10)
  createdAt = createdAt || new Date()

  return new UserEntity(userId, createdAt)
}