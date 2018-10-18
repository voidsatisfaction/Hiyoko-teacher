import { VocabularyEntity } from "../model/Vocabulary";

export interface IVocaRepository {
  findOrCreate(name: string): Promise<VocabularyEntity>
  findByName(name: string): Promise<VocabularyEntity | null>
}