import { expect } from 'chai'
import * as sinon from 'sinon'

import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyListRepository } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyListRepository'
import { UserEntityMock, VocabularyEntityMock } from '../../../helper/factory'
import { VocabularyListEntity } from '../../../../src/hiyokoCore/domain/model/VocabularyList'
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db'

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

  describe('find()', () => {
    it('should get vocabularyList same with vocaListId', async () => {
      const userEntity = UserEntityMock()
      const vocabularyEntity = VocabularyEntityMock()
      const meaning = 'sdlfkmasdlfadkfmlwe'
      const contextSentence = 'glwekmflwm hello world!'
      const contextPictureURL = 'http://helloWOrld.com/picture123.jpg'

      const createdVocabularyListEntity = await vocabularyListAction.create(
        userEntity, vocabularyEntity, meaning, contextSentence, contextPictureURL
      )

      const foundVocabularyListEntity = await vocabularyListLoader.find(createdVocabularyListEntity.vocaListId)

      expect(foundVocabularyListEntity).to.be.deep.equal(createdVocabularyListEntity)
    })
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
      expect(vocabularyLists[0]).to.be.deep.equal(createdVocabularyListEntity2)
      expect(vocabularyLists[1]).to.be.deep.equal(createdVocabularyListEntity1)
    })
  })

  describe('findByUserAndVocabularyAndCreatedAt()', () => {
    it('should be null when there is no vocabularyList', async () => {
      const userEntity = UserEntityMock()
      const vocabularyEntity = VocabularyEntityMock()

      const vocabularyList = await vocabularyListLoader.findByUserAndVocabularyAndCreatedAt(userEntity, vocabularyEntity, new Date())

      expect(vocabularyList).to.be.null
    })

    it('should find by userEntity, vocabularyEntity, createdAt', async () => {
      const userEntity = UserEntityMock()
      const vocabularyEntity = VocabularyEntityMock()
      const meaning = 'よくわからないけどね'
      const contextSentence = 'there is no one in here hello world!'
      const contextPictureURL = 'http://helloWOrld.com/picture.jpg'

      const createdVocabularyListEntity = await vocabularyListAction.create(
        userEntity, vocabularyEntity, meaning, contextSentence, contextPictureURL
      )

      const { createdAt } = createdVocabularyListEntity

      expect(createdVocabularyListEntity).to.be.a.instanceof(VocabularyListEntity)

      const foundVocabularyListEntity = await vocabularyListLoader.findByUserAndVocabularyAndCreatedAt(
        userEntity, vocabularyEntity, createdAt
      )

      expect(foundVocabularyListEntity).to.be.deep.equal(createdVocabularyListEntity)
    })
  })

  describe('delete()', () => {
    it('should delete when there is corresponding vocabularyList', async () => {
      const userEntity = UserEntityMock()
      const vocabularyEntity = VocabularyEntityMock()
      const meaning = 'lkmaflwemflawemkf'
      const contextSentence = 'hello world!'
      const contextPictureURL = 'http://helloWOrld.com/123123.jpg'

      const createdVocabularyListEntity = await vocabularyListAction.create(
        userEntity, vocabularyEntity, meaning, contextSentence, contextPictureURL
      )

      const foundVocabularyListEntity1 = await vocabularyListLoader.findByUserAndVocabularyAndCreatedAt(
        userEntity, vocabularyEntity, createdVocabularyListEntity.createdAt
      )

      expect(foundVocabularyListEntity1).not.to.be.equal(null)

      await vocabularyListAction.delete(createdVocabularyListEntity.vocaListId)

      const foundVocabularyListEntity2 = await vocabularyListLoader.findByUserAndVocabularyAndCreatedAt(
        userEntity, vocabularyEntity, createdVocabularyListEntity.createdAt
      )

      expect(foundVocabularyListEntity2).to.be.equal(null)
    })
  })

  after(() => {
    dbc.close()
  })
})