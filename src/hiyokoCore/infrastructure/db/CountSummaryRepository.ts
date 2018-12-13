import { RepositoryBase } from "./RepositoryBase"
import { IDbClient } from "../../interface/infrastructure/db"
import { ICountSummaryRepository, ICountSummaryLoader, ICountSummaryAction } from "../../domain/repository/CountSummaryRepository"
import { CountSummaryEntity, CountCategory } from "../../domain/model/CountSummary"
import { DateString, DateTime } from "../../../util/DateTime"
import { UserEntity } from "../../domain/model/User";

export class CountSummaryRepositoryComponent {
  dbc: IDbClient

  countSummaryRepository(): ICountSummaryRepository {
    return ({
      countSummaryAction: () => new CountSummaryRepositoryDB(this.dbc),
      countSummaryLoader: () => new CountSummaryRepositoryDB(this.dbc)
    })
  }
}

class CountSummaryRepositoryDB extends RepositoryBase<CountSummaryEntity>
  implements ICountSummaryLoader,
    ICountSummaryAction
  {
  readonly dbc: IDbClient
  private readonly tableName: string
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
    this.tableName = 'Count_summary_table'
  }

  protected parseAs(
    data: any[],
    VocabularyListEntityClass: { new(...args: any[]): CountSummaryEntity }
  ): CountSummaryEntity[] {
    return data.map(d => new CountSummaryEntity(
      d.userId, d.countCategory, new DateTime(d.date), d.count
    ))
  }

  async bulkCreateOrUpdate(
    userEntity: UserEntity,
    countSummaryEntities: CountSummaryEntity[]
  ): Promise<CountSummaryEntity[]> {
    const bulkInsertArgs = countSummaryEntities.map(
      countSummaryEntity => [userEntity.userId, countSummaryEntity.countCategory, countSummaryEntity.date.toDateString(), countSummaryEntity.count]
    )

    await this.dbc.query(`
      INSERT INTO Count_summary_table
        (userId, countCategory, date, count)
      VALUES
        ?
      ON DUPLICATE KEY UPDATE
        count = VALUES(count)
    `, {
      replacements: [bulkInsertArgs],
      type: this.dbc.QueryTypes.INSERT
    })

    return countSummaryEntities
  }

  async createOrUpdate(
    userEntity: UserEntity,
    countCategory: CountCategory,
    dateTime: DateTime
  ): Promise<void> {
    await this.dbc.query(`
      INSERT INTO Count_summary_table
        (userId, countCategory, date, count)
      VALUES
        (:userId, :countCategory, :date, :count)
      ON DUPLICATE KEY UPDATE
        count = count + 1
    `, {
      replacements: {
        userId: userEntity.userId,
        countCategory,
        date: dateTime.toDateString(),
        count: 1
      },
      type: this.dbc.QueryTypes.INSERT
    })
  }

  async find(
    userId: string,
    countCategory: CountCategory,
    date: DateString
  ): Promise<CountSummaryEntity> {
    const countSummaryEntities = await this.findAll(
      userId,
      countCategory,
      [ date ]
    )

    return countSummaryEntities[0]
  }

  async findAll(
    userId: string,
    countCategory: CountCategory,
    dates: DateString[]
  ): Promise<CountSummaryEntity[]> {
    const rows = await this.dbc.query(`
      SELECT * FROM ${this.tableName}
        WHERE userId = (:userId) AND
          countCategory = (:countCategory) AND
          date IN (:dates)
    `, {
      replacements: {
        userId,
        countCategory,
        dates
      },
      type: this.dbc.QueryTypes.SELECT
    })

    const userVocabulryListAddedCounts = this.parseAs(rows, CountSummaryEntity)
      .sort((a, b) => {
        if (a.date < b.date) {
          return -1
        }
        if (a.date > b.date) {
          return 1
        }
        return 0
      })

    const newArray = []
    let i = 0
    dates.forEach(date => {
      const userVocabularyListAddedCount = userVocabulryListAddedCounts[i]

      if (i >= userVocabulryListAddedCounts.length || userVocabularyListAddedCount.date.toDateString() !== date) {
        newArray.push(new CountSummaryEntity(userId, countCategory, new DateTime(date), 0))
      } else {
        newArray.push(userVocabularyListAddedCount)
        i += 1
      }
    })

    return newArray
  }
}