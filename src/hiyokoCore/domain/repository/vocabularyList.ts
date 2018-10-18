import { UserEntity } from "../model/user";
import { VocabularyEntity } from "../model/vocabulary";
import { VocabularyListEntity } from "../model/vocabularyList";

export interface IVocabularyListRepository {
  findByUserAndVocabulary(
    user: UserEntity,
    vocabulary: VocabularyEntity
  ): Promise<VocabularyListEntity | null>

  create(
    user: UserEntity,
    vocabulary: VocabularyEntity,
    meaning: string,
    contextSentence?: string,
    contextPirctureURL?: string
  ): Promise<VocabularyListEntity>
}