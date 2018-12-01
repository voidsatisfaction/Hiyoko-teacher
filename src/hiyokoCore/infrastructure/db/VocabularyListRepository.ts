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

    async find(vocaListId: number): Promise<VocabularyListEntity | null> {
      const rows = await this.dbc.query(`
        SELECT * FROM Vocabulary_lists
          WHERE vocaListId = (:vocaListId)
          LIMIT 1
      `, {
        replacements: {
          vocaListId
        },
        type: this.dbc.QueryTypes.SELECT
      })

      return this.parseAs(rows, VocabularyListEntity)[0] || null
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

    async findByUserAndVocabularyAndCreatedAt(
      user: UserEntity,
      vocabulary: VocabularyEntity,
      createdAt: Date,
    ): Promise<VocabularyListEntity | null> {
      const userId = user.userId
      const vocaId = vocabulary.vocaId

      const rows = await this.dbc.query(`
        SELECT * FROM Vocabulary_lists
          WHERE userId = (:userId) AND vocaId = (:vocaId) AND createdAt = (:createdAt)
          LIMIT 1
      `, {
        replacements: {
          userId,
          vocaId,
          createdAt
        },
        type: this.dbc.QueryTypes.SELECT
      })

      return this.parseAs(rows, VocabularyListEntity)[0] || null
    }

    async create(
      userEntity: UserEntity,
      vocabularyEntity: VocabularyEntity,
      meaning: string,
      contextSentence?: string,
      contextPictureURL?: string,
    ): Promise<VocabularyListEntity> {
      const createdAt = new Date()

      await this.dbc.query(`
        INSERT INTO Vocabulary_lists
          (userId, vocaId, meaning, contextSentence, contextPictureURL, createdAt)
        VALUES
          (:userId, :vocaId, :meaning, :contextSentence, :contextPictureURL, :createdAt)
      `, {
        replacements: {
          userId: userEntity.userId,
          vocaId: vocabularyEntity.vocaId,
          meaning,
          contextSentence,
          contextPictureURL: contextPictureURL || null,
          createdAt
        }
      })

      return await this.findByUserAndVocabularyAndCreatedAt(
        userEntity,
        vocabularyEntity,
        createdAt
      )
    }

    async delete(
      vocaListId: number
    ): Promise<void> {
      await this.dbc.query(`
        DELETE FROM Vocabulary_lists
          WHERE vocaListId = (:vocaListId)
      `, {
        replacements: {
          vocaListId
        }
      })
    }
}