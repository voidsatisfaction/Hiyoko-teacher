import { VocabularyListEntity } from '../model/VocabularyList'
import { IVocabularyRepository } from '../repository/VocabularyRepository'
import { Join } from '../../../util/Join'
import { VocabularyEntity } from '../model/Vocabulary'

export interface IVocabularyListVocabularyRelationObject {
  mergeVocabulary(vocabularyLists: VocabularyListEntity[]): Promise<any[]>
}

export class VocabularyListVocabularyRelationComponent {
  // self type annotation
  vocabularyRepository: () => IVocabularyRepository

  // return singleton object
  vocabularyListVocabularyRelation(): IVocabularyListVocabularyRelationObject {
    return {
      mergeVocabulary: async (vocabularyLists: VocabularyListEntity[]): Promise<any[]> => {
        const vocabularies = await this.vocabularyRepository().vocabularyLoader().findAll(
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
