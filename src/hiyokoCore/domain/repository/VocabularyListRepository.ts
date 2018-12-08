import { UserEntity } from "../model/User";
import { VocabularyEntity } from "../model/Vocabulary";
import { VocabularyListEntity } from "../model/VocabularyList";

export interface IVocabularyListRepository {
  vocabularyListLoader(): IVocabularyListLoader
  vocabularyListAction(): IVocabularyListAction
}

export interface IVocabularyListLoader {
  find(vocaListId: number): Promise<VocabularyListEntity | null>
  findAll(vocaListIds: number[]): Promise<VocabularyListEntity[]>

  findAllByUser(
    user: UserEntity
  ): Promise<VocabularyListEntity[]>

  findByUserWithPriorityCreatedAt(
    user: UserEntity,
    limit?: number
  ): Promise<VocabularyListEntity[]>
}

export interface IVocabularyListAction {
  create(
    user: UserEntity,
    vocabulary: VocabularyEntity,
    meaning: string,
    contextSentence?: string,
    contextPirctureURL?: string,
    priority?: number,
    createdAt?: Date
  ): Promise<VocabularyListEntity>

  update(
    vocabularyListEntity: VocabularyListEntity
  ): Promise<VocabularyListEntity>

  delete(
    vocaListId: number
  ): Promise<void>
}