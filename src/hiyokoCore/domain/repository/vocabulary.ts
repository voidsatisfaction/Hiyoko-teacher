import { VocabularyEntity } from "../model/vocabulary";

export interface IVocaRepository {
  findOrCreate(name: string): Promise<VocabularyEntity>
  findByName(name: string): Promise<VocabularyEntity | null>
}