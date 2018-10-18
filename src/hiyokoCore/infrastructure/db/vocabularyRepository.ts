import { RepositoryBase } from "./repositoryBase";
import { IVocaRepository } from "../../domain/repository/vocabulary";
import { VocabularyEntity } from "../../domain/model/vocabulary";

export class VocabularyRepository extends RepositoryBase<VocabularyEntity> implements IVocaRepository {
  constructor() {

  }

  async findOrCreate(): Promise<VocabularyEntity> {

  }
}