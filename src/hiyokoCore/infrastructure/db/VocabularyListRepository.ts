import { RepositoryBase } from "./RepositoryBase"
import { VocabularyListEntity } from "../../domain/model/VocabularyList"
import { IVocabularyListRepository, IVocabularyListLoader, IVocabularyListAction } from "../../domain/repository/VocabularyListRepository"
import { UserEntity } from "../../domain/model/User"
import { VocabularyEntity } from "../../domain/model/Vocabulary"
import { IDbClient } from "../../interface/infrastructure/db"

export class VocabularyListRepository implements IVocabularyListRepository {
  dbc: IDbClient

  vocabularyListLoader(): IVocabularyListLoader {
    return new VocabularyListDB(this.dbc)
  }

  vocabularyListAction(): IVocabularyListAction {
    return new VocabularyListDB(this.dbc)
  }
}

export class VocabularyListDB extends RepositoryBase<VocabularyListEntity>
  implements IVocabularyListLoader, IVocabularyListAction {
    readonly dbc: IDbClient
    constructor(dbc: IDbClient) {
      super()
      this.dbc = dbc
    }

    protected parseAs(
      data: any[],
      VocabularyListEntityClass: { new(...args: any[]): VocabularyListEntity }
    ): VocabularyListEntity[] {
      return data.map(d => new VocabularyListEntityClass(
          d.vocaListId, d.userId, d.vocaId, d.meaning, d.createdAt, d.contextSentence, d.contextPictureURL
        )
      )
    }

    async findAllByUser(
      user: UserEntity
    ): Promise<VocabularyListEntity[]> {
      const userId = user.userId

      const rows = await this.dbc.query(`
        SELECT * FROM Vocabulary_lists
          WHERE userId = (:userId)
          ORDER BY createdAt DESC
      `, {
        replacements: {
          userId
        },
        type: this.dbc.QueryTypes.SELECT
      })

      return this.parseAs(rows, VocabularyListEntity)
    }

    async findByUserAndVocabulary(
      user: UserEntity,
      vocabulary: VocabularyEntity,
    ): Promise<VocabularyListEntity> {
      const userId = user.userId
      const vocaId = vocabulary.vocaId

      const row = await this.dbc.VocabularyList.findOne({
        where: {
          userId,
          vocaId
        }
      })

      if (!row) {
        return null
      }

      return this.parseAs([row.dataValues], VocabularyListEntity)[0]
    }

    async create(
      userEntity: UserEntity,
      vocabularyEntity: VocabularyEntity,
      meaning: string,
      contextSentence?: string,
      contextPictureURL?: string,
    ): Promise<VocabularyListEntity> {
      const row = await this.dbc.VocabularyList.create({
        userId: userEntity.userId,
        vocaId: vocabularyEntity.vocaId,
        meaning,
        contextSentence,
        contextPictureURL
      })

      return this.parseAs([ row.dataValues ], VocabularyListEntity)[0]
    }
}