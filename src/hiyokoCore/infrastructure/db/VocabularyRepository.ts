import { RepositoryBase } from "./RepositoryBase"
import { IVocabularyRepository, IVocabularyBootstrap, IVocabularyLoader } from "../../domain/repository/VocabularyRepository"
import { VocabularyEntity } from "../../domain/model/Vocabulary"
import { IDbClient } from "../../interface/infrastructure/db"

export class VocabularyRepository implements IVocabularyRepository {
  dbc: IDbClient

  vocabularyBootstrap(): IVocabularyBootstrap {
    return new VocaDB(this.dbc)
  }

  vocabularyLoader(): IVocabularyLoader {
    return new VocaDB(this.dbc)
  }
}

class VocaDB extends RepositoryBase<VocabularyEntity>
  implements IVocabularyBootstrap, IVocabularyLoader {
  protected readonly dbc: IDbClient

  constructor(DbClient: IDbClient) {
    super()
    this.dbc = DbClient
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

  async findAll(ids: number[]): Promise<VocabularyEntity[]> {
    const res = await this.dbc.query(`
      SELECT * FROM Vocabularies
        WHERE vocaId IN (:ids)
    `, {
      replacements: {
        ids
      },
      type: this.dbc.QueryTypes.SELECT
    })

    return this.parseAs(res, VocabularyEntity)
  }
}