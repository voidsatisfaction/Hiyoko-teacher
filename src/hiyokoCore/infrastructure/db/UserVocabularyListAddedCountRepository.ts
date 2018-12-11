import { RepositoryBase } from "./RepositoryBase"
import { IDbClient } from "../../interface/infrastructure/db"
import { IUserVocabularyListAddedCountRepository, IUserVocabularyListAddedCountLoader } from "../../domain/repository/UserVocabularyListAddedCount"
import { UserVocabularyListAddedCountEntity } from "../../domain/model/UserVocabularyListAddedCount"
import { DateString } from "../../../util/Date";

export class UserVocabularyListAddedCountRepositoryComponent {
  dbc: IDbClient

  userVocabularyListAddedCountRepository(): IUserVocabularyListAddedCountRepository {
    return ({
      userVocabulayListAddedCountLoader: () => new UserVocabularyListAddedCountRepositoryDB(this.dbc)
    })
  }
}

class UserVocabularyListAddedCountRepositoryDB extends RepositoryBase<UserVocabularyListAddedCountEntity>
  implements IUserVocabularyListAddedCountLoader {
  readonly dbc: IDbClient
  private readonly tableName: string
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
    this.tableName = 'Vocabulary_lists_added_count'
  }

  protected parseAs(
    data: any[],
    VocabularyListEntityClass: { new(...args: any[]): UserVocabularyListAddedCountEntity }
  ): UserVocabularyListAddedCountEntity[] {
    return data.map(d => new UserVocabularyListAddedCountEntity(
      d.userId, d.date, d.count
    ))
  }

  async findAll(userId: string, dates: DateString[]): Promise<UserVocabularyListAddedCountEntity[]> {
    const rows = await this.dbc.query(`
      SELECT * FROM ${this.tableName}
        WHERE userId = (:userId) AND date IN (:dates)
    `, {
      replacements: {
        userId,
        dates
      },
      type: this.dbc.QueryTypes.SELECT
    })

    return this.parseAs(rows, UserVocabularyListAddedCountEntity)
  }
}