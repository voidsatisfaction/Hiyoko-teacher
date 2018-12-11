import { RepositoryBase } from "./RepositoryBase"
import { IDbClient } from "../../interface/infrastructure/db"
import { ICountSummaryRepository, ICountSummaryLoader } from "../../domain/repository/CountSummaryRepository"
import { CountSummaryEntity, CountCategory } from "../../domain/model/CountSummary"
import { DateString } from "../../../util/Date";

export class CountSummaryRepositoryComponent {
  dbc: IDbClient

  countSummaryRepository(): ICountSummaryRepository {
    return ({
      countSummaryLoader: () => new CountSummaryRepositoryDB(this.dbc)
    })
  }
}

class CountSummaryRepositoryDB extends RepositoryBase<CountSummaryEntity>
  implements ICountSummaryLoader {
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
      d.userId, d.countCategory, new Date(d.date), d.count
    ))
  }

  // FIXME: datetime이 맞지 않을 수 있음
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

      if (i >= userVocabulryListAddedCounts.length || userVocabularyListAddedCount.date.toLocaleDateString() !== date) {
        newArray.push(new CountSummaryEntity(userId, countCategory, new Date(date), 0))
      } else {
        newArray.push(userVocabularyListAddedCount)
        i += 1
      }
    })

    return newArray
  }
}