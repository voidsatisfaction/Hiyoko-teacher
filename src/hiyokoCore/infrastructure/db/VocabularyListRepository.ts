import { RepositoryBase } from "./RepositoryBase"
import { VocabularyListEntity } from "../../domain/model/VocabularyList"
import { IVocabularyListRepository, IVocabularyListLoader, IVocabularyListAction } from "../../domain/repository/VocabularyListRepository"
import { UserEntity } from "../../domain/model/User"
import { VocabularyEntity } from "../../domain/model/Vocabulary"
import { IDbClient } from "../../interface/infrastructure/db"

export class VocabularyListRepositoryComponent {
  dbc: IDbClient

  vocabularyListRepository(): IVocabularyListRepository {
    return ({
      vocabularyListLoader: () => new VocabularyListDB(this.dbc),
      vocabularyListAction: () => new VocabularyListDB(this.dbc)
    })
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
          d.vocaListId, d.userId, d.vocaId, d.meaning, d.priority, d.createdAt, d.contextSentence, d.contextPictureURL
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

    async findAll(vocaListIds: number[]): Promise<VocabularyListEntity[]> {
      if (vocaListIds.length === 0) {
        return []
      }
      const rows = await this.dbc.query(`
        SELECT * FROM Vocabulary_lists
          WHERE vocaListId IN (:vocaListIds)
      `, {
        replacements: {
          vocaListIds
        },
        type: this.dbc.QueryTypes.SELECT
      })

      return this.parseAs(rows, VocabularyListEntity)
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

    async findByUserWithPriorityCreatedAt(
      user: UserEntity,
      limit?: number
    ): Promise<VocabularyListEntity[]> {
      const DEFAULT_LIMIT = 6

      const userId = user.userId
      limit = limit || DEFAULT_LIMIT

      const rows = await this.dbc.query(`
        SELECT * FROM Vocabulary_lists
          WHERE userId = (:userId)
          ORDER BY priority DESC, createdAt ASC
          LIMIT :limit
      `, {
        replacements: {
          userId,
          limit
        },
        type: this.dbc.QueryTypes.SELECT
      })

      return this.parseAs(rows, VocabularyListEntity)
    }

    async create(
      userEntity: UserEntity,
      vocabularyEntity: VocabularyEntity,
      meaning: string,
      contextSentence?: string,
      contextPictureURL?: string,
      priority?: number,
      createdAt?: Date
    ): Promise<VocabularyListEntity> {
      createdAt = createdAt || new Date()
      priority = priority || 100

      const res = await this.dbc.query(`
        INSERT INTO Vocabulary_lists
          (userId, vocaId, meaning, contextSentence, contextPictureURL, createdAt, priority)
        VALUES
          (:userId, :vocaId, :meaning, :contextSentence, :contextPictureURL, :createdAt, :priority)
      `, {
        replacements: {
          userId: userEntity.userId,
          vocaId: vocabularyEntity.vocaId,
          meaning,
          contextSentence,
          contextPictureURL: contextPictureURL || null,
          priority,
          createdAt
        },
        type: this.dbc.QueryTypes.INSERT
      })

      const vocaListId = res[0]

      return await this.find(vocaListId)
    }

    async update(
      vocabularyListEntity: VocabularyListEntity
    ): Promise<VocabularyListEntity> {
      // TODO: add updatedAt column
      const {
        vocaListId, userId, vocaId, meaning, contextSentence, contextPictureURL, priority, createdAt
      } = vocabularyListEntity

      await this.dbc.query(`
        INSERT INTO Vocabulary_lists
          (vocaListId, userId, vocaId, meaning, contextSentence, contextPictureURL, priority, createdAt)
        VALUES
          (:vocaListId, :userId, :vocaId, :meaning, :contextSentence, :contextPictureURL, :priority, :createdAt)
        ON DUPLICATE KEY UPDATE
          meaning = VALUES(meaning),
          contextSentence = VALUES(contextSentence),
          contextPictureURL = VALUES(contextPictureURL),
          priority = VALUES(priority)
      `, {
        replacements: {
          vocaListId,
          userId,
          vocaId,
          meaning,
          contextSentence,
          contextPictureURL: contextPictureURL || null,
          priority,
          createdAt
        }
      })

      return vocabularyListEntity
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
      return
    }
}