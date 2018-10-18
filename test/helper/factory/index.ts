import { UserEntity } from '../../../src/hiyokoCore/domain/model/User'
import { Random } from '../util';
import { VocabularyEntity } from '../../../src/hiyokoCore/domain/model/Vocabulary';
import { DateTime } from '../../../src/util/DateTime';

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