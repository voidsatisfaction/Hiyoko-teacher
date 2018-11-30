import { expect } from 'chai'
import * as sinon from 'sinon'

import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyListRepository } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyListRepository'
import { UserEntityMock, VocabularyEntityMock } from '../../../helper/factory'
import { VocabularyListEntity } from '../../../../src/hiyokoCore/domain/model/VocabularyList'
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db';

class VocabularyListRepositoryTest extends VocabularyListRepository {
  readonly dbc: IDbClient
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

describe('VocabularyList repository test', () => {
  const dbc = new DbClient()
  const vocabularyListRepository = new VocabularyListRepositoryTest(dbc)
  const vocabularyListLoader = vocabularyListRepository.vocabularyListLoader()
  const vocabularyListAction = vocabularyListRepository.vocabularyListAction()

  beforeEach(async () => {
    await Promise.all([
      dbc.truncateTable(dbc.Vocabulary),
      dbc.truncateTable(dbc.VocabularyList)
    ])
  })

  describe('findAllByUser()', () => {
    it('should get all vocabularyLists of the user', async () => {
      const now = sinon.useFakeTimers(new Date())

      const userEntity = UserEntityMock()
      const vocabularyEntity1 = VocabularyEntityMock()
      const meaning1 = 'よくわからないけどね'
      const contextSentence1 = 'there is no one in here hello world!'
      const contextPictureURL1 = 'http://helloWOrld.com/picture.jpg'

      now.tick(0)
      const createdVocabularyListEntity1 = await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1
      )

      const vocabularyEntity2 = VocabularyEntityMock()
      const meaning2 = 'よくわからないけどね2222'
      const contextSentence2 = 'there is no one in here hello 2222222!'
      const contextPictureURL2 = 'http://helloWOrld.com/picture.jpg/2222'

      now.tick(10 * 1000)
      const createdVocabularyListEntity2 = await vocabularyListAction.create(
        userEntity, vocabularyEntity2, meaning2, contextSentence2, contextPictureURL2
      )

      const vocabularyLists = await vocabularyListLoader.findAllByUser(userEntity)

      expect(vocabularyLists.length).to.be.equal(2)
      expect(vocabularyLists[0]).to.be.instanceof(VocabularyListEntity)
      expect([vocabularyLists[0].userId, vocabularyLists[0].vocaId]).to.be.deep.equal([createdVocabularyListEntity2.userId, createdVocabularyListEntity2.vocaId])
      expect([vocabularyLists[1].userId, vocabularyLists[1].vocaId]).to.be.deep.equal([createdVocabularyListEntity1.userId, createdVocabularyListEntity1.vocaId])
    })
  })

  describe('findByName()', () => {
    it('should be null when there is no vocabularyList', async () => {
      const userEntity = UserEntityMock()
      const vocabularyEntity = VocabularyEntityMock()

      const vocabularyList = await vocabularyListLoader.findByUserAndVocabulary(userEntity, vocabularyEntity)

      expect(vocabularyList).to.be.null
    })

    it('should find by name', async () => {
      const userEntity = UserEntityMock()
      const vocabularyEntity = VocabularyEntityMock()
      const meaning = 'よくわからないけどね'
      const contextSentence = 'there is no one in here hello world!'
      const contextPictureURL = 'http://helloWOrld.com/picture.jpg'

      const createdVocabularyListEntity = await vocabularyListAction.create(
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

      const foundVocabularyListEntity = await vocabularyListLoader.findByUserAndVocabulary(
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