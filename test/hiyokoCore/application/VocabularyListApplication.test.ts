import { expect } from 'chai'
import { DbClient } from '../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyListApplication, VocabularyList } from '../../../src/hiyokoCore/application/VocabularyListApplication'
import { UserEntityPersistMock } from '../../helper/factory';
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

  after(() => {
    dbc.close()
  })
})