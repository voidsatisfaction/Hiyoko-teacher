import { UserEntity } from "../model/User";
import { VocabularyEntity } from "../model/Vocabulary";
import { VocabularyListEntity } from "../model/VocabularyList";

export interface IVocabularyListRepository {
  vocabularyListLoader(): IVocabularyListLoader
  vocabularyListAction(): IVocabularyListAction
}

export interface IVocabularyListLoader {
  findByUserAndVocabulary(
    user: UserEntity,
    vocabulary: VocabularyEntity
  ): Promise<VocabularyListEntity | null>
}

export interface IVocabularyListAction {
  create(
    user: UserEntity,
    vocabulary: VocabularyEntity,
    meaning: string,
    contextSentence?: string,
    contextPirctureURL?: string
  ): Promise<VocabularyListEntity>
}