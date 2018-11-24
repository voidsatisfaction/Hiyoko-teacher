import { RepositoryBase } from "./RepositoryBase"
import { IVocaRepository, IVocaBootstrap, IVocaLoader } from "../../domain/repository/VocabularyRepository"
import { VocabularyEntity } from "../../domain/model/Vocabulary"
import { IDbClient } from "../../interface/infrastructure/db"

export class VocabularyRepository implements IVocaRepository {
  dbc: IDbClient

  vocaBootstrap(): IVocaBootstrap {
    return new VocaDB(this.dbc)
  }

  vocaLoader(): IVocaLoader {
    return new VocaDB(this.dbc)
  }
}

class VocaDB extends RepositoryBase<VocabularyEntity>
  implements IVocaBootstrap, IVocaLoader {
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
}