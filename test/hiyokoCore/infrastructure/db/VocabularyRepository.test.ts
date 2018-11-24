import { expect } from 'chai'

import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyRepository } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyRepository'
import { VocabularyEntity } from '../../../../src/hiyokoCore/domain/model/Vocabulary'
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db';

class VocabularyRepositoryTest extends VocabularyRepository {
  readonly dbc: IDbClient

  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

describe('Vocabulary repository test', () => {
  const dbc = new DbClient()
  const vocabularyRepository = new VocabularyRepositoryTest(dbc)
  const vocabularyBootstrap = vocabularyRepository.vocabularyBootstrap()
  const vocabularyLoader = vocabularyRepository.vocabularyLoader()

  beforeEach(async () => {
    await dbc.truncateTable(dbc.Vocabulary)
  })

  describe('findOrCreate()', () => {
    it('should find or create user', async () => {
      const name1 = 'apple juice'
      const name2 = 'home'

      const vocabulary1 = await vocabularyBootstrap.findOrCreate(name1)

      expect(vocabulary1).to.be.a.instanceof(VocabularyEntity)
      expect(vocabulary1.name).to.be.equal(name1)

      const vocabulary2 = await vocabularyBootstrap.findOrCreate(name2)

      expect(vocabulary2).to.be.a.instanceof(VocabularyEntity)
      expect(vocabulary2.name).to.be.equal(name2)
    })
  })

  describe('findByName()', () => {
    it('should find vocabulary by name', async () => {
      const name = 'turn down'

      await vocabularyBootstrap.findOrCreate(name)

      const foundVocabulary = await vocabularyLoader.findByName(name)

      expect(foundVocabulary).to.be.an.instanceof(VocabularyEntity)
      expect(foundVocabulary.name).to.be.equal(name)
    })
  });

  after(() => {
    dbc.close()
  })
})