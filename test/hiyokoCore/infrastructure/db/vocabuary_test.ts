import { expect } from 'chai'

import { dbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyRepository } from '../../../../src/hiyokoCore/infrastructure/db/vocabularyRepository'
import { VocabularyEntity } from '../../../../src/hiyokoCore/domain/model/vocabulary';

describe('Vocabulary repository test', () => {
  const dbc = new dbClient()
  const vocabularyRepository = new VocabularyRepository(dbc)

  beforeEach(async () => {
    await dbc.truncateTable(dbc.Vocabulary)
  })

  describe('findOrCreate()', () => {
    it('should find or create user', async () => {
      const name1 = 'apple juice'
      const name2 = 'home'

      const vocabulary1 = await vocabularyRepository.findOrCreate(name1)

      expect(vocabulary1).to.be.a.instanceof(VocabularyEntity)
      expect(vocabulary1.name).to.be.equal(name1)

      const vocabulary2 = await vocabularyRepository.findOrCreate(name2)

      expect(vocabulary2).to.be.a.instanceof(VocabularyEntity)
      expect(vocabulary2.name).to.be.equal(name2)
    })
  })

  describe('findByName()', () => {
    it('should find vocabulary by name', async () => {
      const name = 'turn down'

      await vocabularyRepository.findOrCreate(name)

      const foundVocabulary = await vocabularyRepository.findByName(name)

      expect(foundVocabulary).to.be.an.instanceof(VocabularyEntity)
      expect(foundVocabulary.name).to.be.equal(name)
    })
  });

  after(() => {
    dbc.close()
  })
})