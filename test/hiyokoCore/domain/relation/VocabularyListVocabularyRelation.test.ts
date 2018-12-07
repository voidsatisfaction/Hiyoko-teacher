import { expect } from 'chai'
import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { VocabularyListEntityPersistMock } from '../../../helper/factory'
import { applyMixins } from '../../../../src/util/Mixin'
import { VocabularyRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyRepository'
import { IVocabularyRepository } from '../../../../src/hiyokoCore/domain/repository/VocabularyRepository'
import { VocabularyListVocabularyRelationComponent, IVocabularyListVocabularyRelationObject } from '../../../../src/hiyokoCore/domain/relation/VocabularyListVocabularyRelation'
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db'

class VocabularyListVocabularyRelationTest
  implements VocabularyRepositoryComponent, VocabularyListVocabularyRelationComponent {

  readonly dbc: IDbClient
  readonly vocabularyListVocabularyRelationObject: IVocabularyListVocabularyRelationObject
  constructor() {
    // FIXME: implements
    this.dbc = new DbClient()
  }

  vocabularyRepository: () => IVocabularyRepository

  vocabularyListVocabularyRelation: () => IVocabularyListVocabularyRelationObject

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

          const mergedVocas = await this.vocabularyListVocabularyRelation().mergeVocabulary([vocabularyListEntity1, vocabularyListEntity2, vocabularyListEntity3])

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
  [
    VocabularyRepositoryComponent,
    VocabularyListVocabularyRelationComponent
  ]
)

new VocabularyListVocabularyRelationTest().do()