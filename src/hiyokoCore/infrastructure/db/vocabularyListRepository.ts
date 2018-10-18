import { RepositoryBase } from "./repositoryBase";
import { VocabularyListEntity } from "../../domain/model/vocabularyList";
import { IVocabularyListRepository } from "../../domain/repository/vocabularyList";
import { dbClient } from "./client";
import { UserEntity } from "../../domain/model/user";
import { VocabularyEntity } from "../../domain/model/vocabulary";

export class VocabularyListRepository extends RepositoryBase<VocabularyListEntity>
  implements IVocabularyListRepository {
    readonly dbc: dbClient
    constructor(dbc: dbClient) {
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