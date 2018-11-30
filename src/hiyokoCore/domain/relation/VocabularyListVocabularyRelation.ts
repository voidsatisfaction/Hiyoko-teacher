import { VocabularyListEntity } from '../model/VocabularyList'
import { IVocabularyLoader } from '../repository/VocabularyRepository'
import { Join } from '../../../util/Join'
import { VocabularyEntity } from '../model/Vocabulary'

export interface IVocabularyListVocabularyRelationObject {
  mergeVocabulary(vocabularyLists: VocabularyListEntity[]): Promise<any[]>
}

export class VocabularyListVocabularyRelationComponent {
  // self type annotation
  vocabularyLoader: () => IVocabularyLoader

  // return singleton object
  vocabularyListVocabularyRelation(): IVocabularyListVocabularyRelationObject {
    return {
      mergeVocabulary: async (vocabularyLists: VocabularyListEntity[]): Promise<any[]> => {
        const vocabularies = await this.vocabularyLoader().findAll(
          vocabularyLists.map(d => d.vocaId)
        )

        const join = new Join<VocabularyListEntity, VocabularyEntity>()
        return join.Inner()
          .source(vocabularyLists)
          .on('vocaId')
          .merge(vocabularies)
      }
    }
  }
}
