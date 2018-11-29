import { expect } from 'chai'
import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyListEntityPersistMock } from '../../../helper/factory'
import { applyMixins } from '../../../../src/util/Mixin'
import { VocabularyRepository } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyRepository'
import { IVocabularyBootstrap, IVocabularyLoader } from '../../../../src/hiyokoCore/domain/repository/VocabularyRepository'
import { VocabularyVocabularyListRelation } from '../../../../src/hiyokoCore/domain/relation/VocabularyListVocabularyRelation'
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db'
import { VocabularyListEntity } from '../../../../src/hiyokoCore/domain/model/VocabularyList'

class VocabularyListVocabularyRelationTest
  implements VocabularyRepository, VocabularyVocabularyListRelation {

  dbc: IDbClient
  constructor() {
    // FIXME: implements
    this.dbc = new DbClient()
  }

  vocabularyBootstrap: () => IVocabularyBootstrap
  vocabularyLoader: () => IVocabularyLoader

  mergeVocabulary: (vocabularyLists: VocabularyListEntity[]) => Promise<any[]>

  do() {
    describe('VocabularyListVocabularyRelation test', () => {

      beforeEach(async () => {
        await this.dbc.truncateTable(this.dbc.Vocabulary)
        await this.dbc.truncateTable(this.dbc.VocabularyList)
      })

      describe('mergeVocabulary()', () => {
        it('should merge vocabularies to vocabulary lists', async () => {
          const [vocabularyEntity1, vocabularyListEntity1] = await VocabularyListEntityPersistMock(this.dbc)
          const [vocabularyEntity2, vocabularyListEntity2] = await VocabularyListEntityPersistMock(this.dbc)
          const [vocabularyEntity3, vocabularyListEntity3] = await VocabularyListEntityPersistMock(this.dbc)

          const mergedVocas = await this.mergeVocabulary([ vocabularyListEntity1, vocabularyListEntity2, vocabularyListEntity3 ])

          expect(mergedVocas.length).to.equal(3)
          expect(mergedVocas[0]).to.deep.equal({ ...vocabularyEntity1, ...vocabularyListEntity1 })
          expect(mergedVocas[1]).to.deep.equal({ ...vocabularyEntity2, ...vocabularyListEntity2 })
          expect(mergedVocas[2]).to.deep.equal({ ...vocabularyEntity3, ...vocabularyListEntity3 })
        })
      })

      after(() => {
        this.dbc.close()
      })
    })
  }
}

applyMixins(
  VocabularyListVocabularyRelationTest,
  [VocabularyRepository, VocabularyVocabularyListRelation]
)

new VocabularyListVocabularyRelationTest().do()