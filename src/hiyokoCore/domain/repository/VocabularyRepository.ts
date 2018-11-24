import { VocabularyEntity } from "../model/Vocabulary";

export interface IVocaRepository {
  vocaBootstrap: () => IVocaBootstrap
  vocaLoader: () => IVocaLoader
}

export interface IVocaLoader {
  findByName(name: string): Promise<VocabularyEntity | null>
}

export interface IVocaBootstrap {
  findOrCreate(name: string): Promise<VocabularyEntity>
}