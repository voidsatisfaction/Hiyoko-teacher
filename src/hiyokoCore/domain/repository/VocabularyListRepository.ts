import { UserEntity } from "../model/User";
import { VocabularyEntity } from "../model/Vocabulary";
import { VocabularyListEntity } from "../model/VocabularyList";

export interface IVocabularyListRepository {
  vocabularyListLoader(): IVocabularyListLoader
  vocabularyListAction(): IVocabularyListAction
}

export interface IVocabularyListLoader {
  find(vocaListId: number): Promise<VocabularyListEntity | null>

  findByUserAndVocabularyAndCreatedAt(
    user: UserEntity,
    vocabulary: VocabularyEntity,
    createdAt: Date,
  ): Promise<VocabularyListEntity | null>

  findAllByUser(
    user: UserEntity
  ): Promise<VocabularyListEntity[]>
}

export interface IVocabularyListAction {
  create(
    user: UserEntity,
    vocabulary: VocabularyEntity,
    meaning: string,
    contextSentence?: string,
    contextPirctureURL?: string
  ): Promise<VocabularyListEntity>

  delete(
    vocaListId: number
  ): Promise<void>
}