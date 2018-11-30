import { expect } from 'chai'
import * as sinon from 'sinon'
import { DbClient } from '../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyListApplication, VocabularyList } from '../../../src/hiyokoCore/application/VocabularyListApplication'
import { UserEntityPersistMock, VocabularyListEntityPersistMock } from '../../helper/factory';
import { VocabularyRepository } from '../../../src/hiyokoCore/infrastructure/db/VocabularyRepository';
import { IDbClient } from '../../../src/hiyokoCore/interface/infrastructure/db';

class VocabularyRepositoryTest extends VocabularyRepository {
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

      const vocabulary = await vocabularyRepository.vocabularyLoader().findByName(vocaName)

      expect(vocabulary.name).to.be.equal(vocaName)
    })
  })

  describe('getUserVocabularyLists()', () => {
    it('should list all of vocabularyList of a certain user', async () => {
      const now = sinon.useFakeTimers(new Date())
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

  after(() => {
    dbc.close()
  })
})