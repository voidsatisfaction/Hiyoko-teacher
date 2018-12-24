import { expect } from 'chai'
import * as sinon from 'sinon'
import { DbClient } from '../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyListApplication, VocabularyList } from '../../../src/hiyokoCore/application/VocabularyListApplication'
import { UserEntityPersistMock, VocabularyListEntityPersistMock } from '../../helper/factory';
import { VocabularyRepositoryComponent } from '../../../src/hiyokoCore/infrastructure/db/VocabularyRepository';
import { IDbClient } from '../../../src/hiyokoCore/interface/infrastructure/db';
import { VocabularyListApplicationUnauthorizationError } from '../../../src/hiyokoCore/application/error';
import { VocabularyListRepositoryComponent } from '../../../src/hiyokoCore/infrastructure/db/VocabularyListRepository';
import { DateTime } from '../../../src/util/DateTime';

class VocabularyRepositoryTest extends VocabularyRepositoryComponent {
  readonly dbc: IDbClient

  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

class VocabularyListRepositoryTest extends VocabularyListRepositoryComponent {
  readonly dbc: IDbClient

  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

describe('VocabularyListApplication test', () => {
  const dbc = new DbClient()

  beforeEach(async () => {
    await dbc.truncateTable(dbc.Vocabulary)
    await dbc.truncateTable(dbc.VocabularyList)
  })

  describe('addVocabularyToList()', () => {
    it('should add both vocabulary and vocabularylist', async () => {
      const persistUser = await UserEntityPersistMock(dbc)
      const vocabularyListApplication = new VocabularyListApplication(persistUser.userId)
      const vocabularyRepository = new VocabularyRepositoryTest(dbc)

      const vocaName = 'test man'
      const meaning = '테스트 하는 사람'
      const vocaContextSentence = 'hello, test man My name is your name'

      const vocaListEntity = await vocabularyListApplication.addVocabularyToList(vocaName, meaning, vocaContextSentence)

      expect(vocaListEntity).to.be.an.instanceof(VocabularyList)
      expect(vocaListEntity.userId).to.be.equal(persistUser.userId)
      expect(vocaListEntity.name).to.be.equal(vocaName)
      expect(vocaListEntity.meaning).to.be.equal(meaning)
      expect(vocaListEntity.contextSentence).to.be.equal(vocaContextSentence)

      const vocabulary = await vocabularyRepository.vocabularyRepository().vocabularyLoader().findByName(vocaName)

      expect(vocabulary.name).to.be.equal(vocaName)
    })
  })

  describe('getUserVocabularyLists()', () => {
    it('should list all of vocabularyList of a certain user', async () => {
      const now = sinon.useFakeTimers(new DateTime().toDate())
      const persistUser = await UserEntityPersistMock(dbc)
      const vocabularyListApplication = new VocabularyListApplication(persistUser.userId)

      now.tick(0)
      const [vocabularyEntity1, vocabularyListEntity1] = await VocabularyListEntityPersistMock(dbc, persistUser)

      now.tick(10 * 1000)
      const [vocabularyEntity2, vocabularyListEntity2] = await VocabularyListEntityPersistMock(dbc, persistUser)

      now.tick(20 * 1000)
      const [vocabularyEntity3, vocabularyListEntity3] = await VocabularyListEntityPersistMock(dbc, persistUser)

      const vocabularyLists = await vocabularyListApplication.getUserVocabularyLists()

      expect(vocabularyLists.length).to.be.equal(3)
      expect(vocabularyLists[0].name).to.be.equal(vocabularyEntity3.name)
      expect(vocabularyLists[1].name).to.be.equal(vocabularyEntity2.name)
      expect(vocabularyLists[2].name).to.be.equal(vocabularyEntity1.name)
      now.restore()
    })
  })

  describe('editVocabularyList()', () => {
    it('should edit vocabularyList', async () => {
      const persistUser = await UserEntityPersistMock(dbc)
      const vocabularyListApplication = new VocabularyListApplication(persistUser.userId)

      const [vocabularyEntity, persistVocabularyListEntity] = await VocabularyListEntityPersistMock(dbc, persistUser)

      const foundVocabularyLists = await vocabularyListApplication.getUserVocabularyLists()

      expect(foundVocabularyLists[0].toVocabularyListEntity()).to.be.deep.equal(persistVocabularyListEntity)

      const newMeaning = 'hello world new meaning'
      const newContextSentence = 'lkasmdflakmdlmfam'
      const newVocabularyList = new VocabularyList(
        persistVocabularyListEntity.userId, persistVocabularyListEntity.vocaListId, persistVocabularyListEntity.vocaId,
        vocabularyEntity.name, newMeaning, newContextSentence, persistVocabularyListEntity.priority, persistVocabularyListEntity.createdAt
      )

      const editedVocabularyList = await vocabularyListApplication.editUserVocabularyList(
        newVocabularyList.vocaListId, newMeaning, newContextSentence
      )

      expect(editedVocabularyList.meaning).to.equal(newMeaning)
      expect(editedVocabularyList.contextSentence).to.equal(newContextSentence)

      const foundVocabularyLists2 = await vocabularyListApplication.getUserVocabularyLists()

      expect(foundVocabularyLists2[0]).to.be.deep.equal(editedVocabularyList)
    })
  })

  describe('deleteVocabularyList()', () => {
    it('should be unauthorized error when userId is not matching', async () => {
      try {
        const persistUser1 = await UserEntityPersistMock(dbc)
        const persistUser2 = await UserEntityPersistMock(dbc)
        const vocabularyListApplication2 = new VocabularyListApplication(persistUser2.userId)

        const [vocabularyEntity, vocabularyListEntity] = await VocabularyListEntityPersistMock(dbc, persistUser1)

        await vocabularyListApplication2.deleteVocabularyList(vocabularyListEntity.vocaListId)
      } catch(e) {
        expect(e.message).to.be.equal(new VocabularyListApplicationUnauthorizationError(`Delete vocabularyList not authorized`).message)
      }
    })

    it('should delete vocabularyList', async () => {
      const persistUser1 = await UserEntityPersistMock(dbc)
      const vocabularyListApplication1 = new VocabularyListApplication(persistUser1.userId)
      const vocabularyListRepository = new VocabularyListRepositoryTest(dbc)

      const [vocabularyEntity, vocabularyListEntity] = await VocabularyListEntityPersistMock(dbc, persistUser1)

      await vocabularyListApplication1.deleteVocabularyList(vocabularyListEntity.vocaListId)

      const emptyVocabularyList = await vocabularyListRepository.vocabularyListRepository().vocabularyListLoader().find(vocabularyListEntity.vocaListId)

      expect(emptyVocabularyList).to.be.equal(null)
    })
  })

  after(() => {
    dbc.close()
  })
})