import { UserEntity } from '../../../src/hiyokoCore/domain/model/User'
import { Random } from '../util';
import { VocabularyEntity } from '../../../src/hiyokoCore/domain/model/Vocabulary';
import { DateTime } from '../../../src/util/DateTime';
import { UserRepository } from '../../../src/hiyokoCore/infrastructure/db/UserRepository';
import { IDbClient } from '../../../src/hiyokoCore/interface/infrastructure/db';

class UserRepositoryMock extends UserRepository {
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

export const UserEntityPersistMock = async (dbc: IDbClient, userId?: string, createdAt?: Date): Promise<UserEntity> => {
  userId = userId || Random.alphaNumeric(10)
  createdAt = createdAt || new DateTime()

  const userRepositoryMock: UserRepositoryMock = new UserRepositoryMock(dbc)
  return await userRepositoryMock.userBootstrap().findOrCreate(userId)
}

export const UserEntityMock = (userId?: string, createdAt?: Date): UserEntity => {
  userId = userId || Random.alphaNumeric(10)
  createdAt = createdAt || new DateTime()

  return new UserEntity(userId, createdAt)
}

export const VocabularyEntityMock = (vocaId?: number, name?: string): VocabularyEntity => {
  vocaId = vocaId || Random.numeric(10)
  name = name || Random.alphabetic(10)

  return new VocabularyEntity(vocaId, name)
}