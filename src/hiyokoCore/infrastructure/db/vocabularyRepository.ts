import { RepositoryBase } from "./RepositoryBase"
import { IVocaRepository } from "../../domain/repository/Vocabulary"
import { VocabularyEntity } from "../../domain/model/Vocabulary"
import { dbClient } from "./client"

export class VocabularyRepository extends RepositoryBase<VocabularyEntity> implements IVocaRepository {
  protected readonly dbc: dbClient

  constructor(dbClient: dbClient) {
    super()
    this.dbc = dbClient
  }

  protected parseAs(
    data: any[],
    VocabularyEntityClass: { new(...args: any[]): VocabularyEntity }
  ): VocabularyEntity[] {
    return data.map(d => new VocabularyEntityClass(d.vocaId, d.name))
  }

  async findOrCreate(name: string): Promise<VocabularyEntity> {
    const res = await this.dbc.Vocabulary.findOrCreate({
      where: {
        name
      }
    }).spread(data => [data])

    return this.parseAs(res.map(d => d.dataValues), VocabularyEntity)[0]
  }

  async findByName(name: string): Promise<VocabularyEntity | null> {
    const res = await this.dbc.Vocabulary.findOne({
      where: {
        name
      }
    })

    if (!res) {
      return null
    }

    return this.parseAs([ res.dataValues ], VocabularyEntity)[0]
  }
}