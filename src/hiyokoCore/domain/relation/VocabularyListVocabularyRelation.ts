import { VocabularyListEntity } from '../model/VocabularyList'
import { IVocabularyLoader } from '../repository/VocabularyRepository';
import { Join } from '../../../util/Join';
import { VocabularyEntity } from '../model/Vocabulary';

export class VocabularyVocabularyListRelation {
  vocabularyLoader: () => IVocabularyLoader

  // FIXME: fix return value type not any
  async mergeVocabulary(vocabularyLists: VocabularyListEntity[]): Promise<any[]> {
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