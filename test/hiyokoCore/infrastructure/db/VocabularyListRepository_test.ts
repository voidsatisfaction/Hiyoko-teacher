import { expect } from 'chai'

import { dbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyListRepository } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyListRepository'
import { UserEntityMock, VocabularyEntityMock } from '../../../helper/factory';
import { VocabularyListEntity } from '../../../../src/hiyokoCore/domain/model/VocabularyList';

describe('VocabularyList repository test', () => {
  const dbc = new dbClient()
  const vocabularyListRepository = new VocabularyListRepository(dbc)

  beforeEach(async () => {
    await dbc.truncateTable(dbc.Vocabulary)
  })

  describe('findByName()', () => {
    it('should be null when there is no vocabularyList', async() => {
      const userEntity = UserEntityMock()
      const vocabularyEntity = VocabularyEntityMock()

      const vocabularyList = await vocabularyListRepository.findByUserAndVocabulary(userEntity, vocabularyEntity)

      expect(vocabularyList).to.be.null
    })

    it('should find by name', async () => {
      const userEntity = UserEntityMock()
      const vocabularyEntity = VocabularyEntityMock()
      const meaning = 'よくわからないけどね'
      const contextSentence = 'there is no one in here hello world!'
      const contextPictureURL = 'http://helloWOrld.com/picture.jpg'

      const createdVocabularyListEntity = await vocabularyListRepository.create(
        userEntity, vocabularyEntity, meaning, contextSentence, contextPictureURL
      )

      const {
        userId,
        vocaId,
      } = createdVocabularyListEntity
      const foundMeaning = createdVocabularyListEntity.meaning
      const foundContextSentence = createdVocabularyListEntity.contextSentence
      const foundContextPictureURL = createdVocabularyListEntity.contextPictureURL

      expect(createdVocabularyListEntity).to.be.a.instanceof(VocabularyListEntity)
      expect(userId).to.be.equal(userEntity.userId)
      expect(vocaId).to.be.equal(vocabularyEntity.vocaId)
      expect(foundMeaning).to.be.equal(meaning)
      expect(foundContextSentence).to.be.equal(contextSentence)
      expect(foundContextPictureURL).to.be.equal(contextPictureURL)

      const foundVocabularyListEntity = await vocabularyListRepository.findByUserAndVocabulary(
        userEntity, vocabularyEntity
      )

      expect(foundVocabularyListEntity.userId).to.be.deep.equal(createdVocabularyListEntity.userId)
      expect(foundVocabularyListEntity.vocaId).to.be.deep.equal(createdVocabularyListEntity.vocaId)
      expect(foundVocabularyListEntity.meaning).to.be.deep.equal(createdVocabularyListEntity.meaning)
      expect(foundVocabularyListEntity.contextSentence).to.be.deep.equal(createdVocabularyListEntity.contextSentence)
      expect(foundVocabularyListEntity.contextPictureURL).to.be.deep.equal(createdVocabularyListEntity.contextPictureURL)
    })
  })

  after(() => {
    dbc.close()
  })
})