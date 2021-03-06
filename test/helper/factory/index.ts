import { UserEntity } from '../../../src/hiyokoCore/domain/model/User'
import { Random } from '../util'

import { VocabularyEntity } from '../../../src/hiyokoCore/domain/model/Vocabulary'
import { VocabularyListEntity } from '../../../src/hiyokoCore/domain/model/VocabularyList'

import { UserRepositoryComponent } from '../../../src/hiyokoCore/infrastructure/db/UserRepository'
import { IDbClient } from '../../../src/hiyokoCore/interface/infrastructure/db'

import { VocabularyRepositoryComponent } from '../../../src/hiyokoCore/infrastructure/db/VocabularyRepository'
import { VocabularyListRepositoryComponent } from '../../../src/hiyokoCore/infrastructure/db/VocabularyListRepository'
import { UserProductRepositoryComponent } from '../../../src/hiyokoCore/infrastructure/db/UserProductImplement';
import { DateTime } from '../../../src/util/DateTime';

class UserRepositoryMock extends UserRepositoryComponent {
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

class UserProductRepositoryMock extends UserProductRepositoryComponent {
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

export const UserEntityPersistMock = async (dbc: IDbClient, userId?: string, createdAt?: DateTime, productId?: number): Promise<UserEntity> => {
  userId = userId || Random.alphaNumeric(10)
  createdAt = createdAt || new DateTime()
  productId = productId || 0

  const userRepositoryMock: UserRepositoryMock = new UserRepositoryMock(dbc)
  const userProductRepositoryMock: UserProductRepositoryMock = new UserProductRepositoryMock(dbc)

  const user = await userRepositoryMock.userRepository().userBootstrap().findOrCreate(userId)
  await userProductRepositoryMock.userProductRepository().userProductAction().create(user.userId, productId)

  return user
}

export const UserEntityMock = (userId?: string, createdAt?: DateTime): UserEntity => {
  userId = userId || Random.alphaNumeric(10)
  createdAt = createdAt || new DateTime()

  return new UserEntity(userId, createdAt)
}

class VocabularyRepositoryMock extends VocabularyRepositoryComponent {
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

export const VocabularyEntityMock = (vocaId?: number, name?: string): VocabularyEntity => {
  vocaId = vocaId || Random.numeric(10)
  name = name || Random.alphabetic(10)

  return new VocabularyEntity(vocaId, name)
}

class VocabularyListRepositoryMock extends VocabularyListRepositoryComponent {
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

export const VocabularyListEntityPersistMock = async (
  dbc: IDbClient,
  user?: UserEntity,
  name?: string,
  meaning?: string,
  contextSentence?: string,
  priority?: number,
  createdAt?: DateTime
): Promise<[VocabularyEntity, VocabularyListEntity]> => {
  name = name || Random.alphabetic(8)
  meaning = meaning || Random.alphaNumeric(10)
  contextSentence = contextSentence || Random.alphaNumeric(30)
  priority = priority || 100
  createdAt = createdAt || new DateTime()

  const vocabularyRepositoryMock = new VocabularyRepositoryMock(dbc)
  const vocabularyListRepositoryMock = new VocabularyListRepositoryMock(dbc)

  const userEntity = user || UserEntityMock()
  const vocabularyEntity = await vocabularyRepositoryMock.vocabularyRepository().vocabularyBootstrap().findOrCreate(name)
  const vocabularyListEntity = await vocabularyListRepositoryMock.vocabularyListRepository().vocabularyListAction().create(
    userEntity, vocabularyEntity, meaning, contextSentence, undefined, priority, createdAt
  )

  return [vocabularyEntity, vocabularyListEntity]
}