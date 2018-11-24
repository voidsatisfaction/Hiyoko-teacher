import { RepositoryBase } from "./RepositoryBase";
import { VocabularyListEntity } from "../../domain/model/VocabularyList";
import { IVocabularyListRepository } from "../../domain/repository/VocabularyListRepository";
import { DbClient } from "./client";
import { UserEntity } from "../../domain/model/User";
import { VocabularyEntity } from "../../domain/model/Vocabulary";

export class VocabularyListRepository extends RepositoryBase<VocabularyListEntity>
  implements IVocabularyListRepository {
    readonly dbc: DbClient
    constructor(dbc: DbClient) {
      super()
      this.dbc = dbc
    }

    protected parseAs(
      data: any[],
      VocabularyListEntityClass: { new(...args: any[]): VocabularyListEntity }
    ): VocabularyListEntity[] {
      return data.map(d => new VocabularyListEntityClass(
          d.userId, d.vocaId, d.meaning, d.createdAt, d.contextSentence, d.contextPictureURL
        )
      )
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