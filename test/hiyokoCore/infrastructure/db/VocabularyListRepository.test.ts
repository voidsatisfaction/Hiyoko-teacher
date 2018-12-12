import { expect } from 'chai'
import * as sinon from 'sinon'

import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyListRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyListRepository'
import { UserEntityMock, VocabularyEntityMock } from '../../../helper/factory'
import { VocabularyListEntity } from '../../../../src/hiyokoCore/domain/model/VocabularyList'
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db'
import { DateTime } from '../../../../src/util/DateTime';

class VocabularyListRepositoryTest extends VocabularyListRepositoryComponent {
  readonly dbc: IDbClient
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

describe('VocabularyList repository test', () => {
  const dbc = new DbClient()
  const vocabularyListRepository = new VocabularyListRepositoryTest(dbc)
  const vocabularyListLoader = vocabularyListRepository.vocabularyListRepository().vocabularyListLoader()
  const vocabularyListAction = vocabularyListRepository.vocabularyListRepository().vocabularyListAction()

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
      const now = sinon.useFakeTimers(new DateTime().toDate())

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

      now.restore()

      expect(vocabularyLists.length).to.be.equal(2)
      expect(vocabularyLists[0]).to.be.instanceof(VocabularyListEntity)
      expect(vocabularyLists[0]).to.be.deep.equal(createdVocabularyListEntity2)
      expect(vocabularyLists[1]).to.be.deep.equal(createdVocabularyListEntity1)
    })
  })

  describe('findByUserWithPriorityCreatedAt()', () => {
    it('should be well ordered with priority and createdAt', async () => {
      const now = sinon.useFakeTimers(new DateTime().toDate())

      const userEntity = UserEntityMock()
      const vocabularyEntity1 = VocabularyEntityMock()
      const meaning1 = 'よくわからないけどね'
      const contextSentence1 = 'there is no one in here hello world!'
      const contextPictureURL1 = 'http://helloWOrld.com/picture.jpg'
      const priority1 = 50

      now.tick(0)
      const createdVocabularyListEntity1 = await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1, priority1
      )

      now.tick(20 * 1000)
      const createdVocabularyListEntity2 = await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1, priority1 + 20
      )

      now.tick(10 * 1000)
      const createdVocabularyListEntity3 = await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1, priority1 + 40
      )

      now.tick(30 * 1000)
      const createdVocabularyListEntity4 = await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1, priority1 + 20
      )

      now.restore()

      const vocabularyLists = await vocabularyListLoader.findByUserWithPriorityCreatedAt(userEntity)

      expect(vocabularyLists.length).to.be.equal(4)
      expect(vocabularyLists[0]).to.be.instanceOf(VocabularyListEntity)
      expect(vocabularyLists[0].vocaListId).to.be.equal(createdVocabularyListEntity3.vocaListId)
      expect(vocabularyLists[1].vocaListId).to.be.equal(createdVocabularyListEntity2.vocaListId)
      expect(vocabularyLists[2].vocaListId).to.be.equal(createdVocabularyListEntity4.vocaListId)
      expect(vocabularyLists[3].vocaListId).to.be.equal(createdVocabularyListEntity1.vocaListId)
    })
  })

  describe('update()', () => {
    it('should update with vocabularyListEntity', async () => {
      const userEntity = UserEntityMock()
      const vocabularyEntity1 = VocabularyEntityMock()
      const meaning1 = 'よくわからないけどね'
      const contextSentence1 = 'there is no one in here hello world!'
      const contextPictureURL1 = 'http://helloWOrld.com/picture.jpg'

      const createdVocabularyListEntity = await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1
      )

      const vocaListId2 = createdVocabularyListEntity.vocaListId
      const priority2 = 10
      const meaning2 = 'よくわからないけどね2222'
      const contextSentence2 = 'there is no one in here hello 2222222!'
      const contextPictureURL2 = 'http://helloWOrld.com/picture.jpg/2222'

      const newVocabularyListEntity = new VocabularyListEntity(
        vocaListId2,
        createdVocabularyListEntity.userId,
        createdVocabularyListEntity.vocaId,
        meaning2,
        priority2,
        new DateTime(),
        contextSentence2,
        contextPictureURL2
      )

      const updatedVocabularyListEntity = await vocabularyListAction.update(
        newVocabularyListEntity
      )

      const foundVocabularyListEntity = await vocabularyListLoader.find(
        vocaListId2
      )

      expect(updatedVocabularyListEntity.meaning).to.be.equal(foundVocabularyListEntity.meaning)
      expect(updatedVocabularyListEntity.priority).to.be.equal(foundVocabularyListEntity.priority)
      expect(updatedVocabularyListEntity.contextSentence).to.be.equal(foundVocabularyListEntity.contextSentence)
      expect(updatedVocabularyListEntity.contextPictureURL).to.be.equal(foundVocabularyListEntity.contextPictureURL)

      expect(updatedVocabularyListEntity.vocaListId).to.be.equal(createdVocabularyListEntity.vocaListId)
      expect(updatedVocabularyListEntity.vocaId).to.be.equal(createdVocabularyListEntity.vocaId)
      expect(updatedVocabularyListEntity.userId).to.be.equal(createdVocabularyListEntity.userId)
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

      const foundVocabularyListEntity1 = await vocabularyListLoader.find(
        createdVocabularyListEntity.vocaListId
      )

      expect(foundVocabularyListEntity1).not.to.be.equal(null)

      await vocabularyListAction.delete(createdVocabularyListEntity.vocaListId)

      const foundVocabularyListEntity2 = await vocabularyListLoader.find(
        createdVocabularyListEntity.vocaListId
      )

      expect(foundVocabularyListEntity2).to.be.equal(null)
    })
  })

  after(() => {
    dbc.close()
  })
})