import { VocabularyEntity } from "../model/Vocabulary";

export interface IVocabularyRepository {
  vocabularyBootstrap: () => IVocabularyBootstrap
  vocabularyLoader: () => IVocabularyLoader
}

export interface IVocabularyBootstrap {
  findOrCreate(name: string): Promise<VocabularyEntity>
}

export interface IVocabularyLoader {
  findByName(name: string): Promise<VocabularyEntity | null>
}