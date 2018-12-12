import { DbClientComponent } from "../infrastructure/db/client";
import { LoggerDBClientComponent } from "../infrastructure/loggerDb/client";
import { UserHelperComponent, IUserHelper } from "./helper/UserHelper";
import { UserActionLogHelperComponent, IUserActionLoggerObject, Action } from "./helper/UserActionLogHelper";
import { IDbClient } from "../interface/infrastructure/db";
import { ILoggerDBClient } from "../interface/infrastructure/LoggerDB";
import { applyMixins } from "../../util/Mixin";
import { IUserRepository } from "../domain/repository/UserRepository";
import { IUserProductRepository } from "../domain/repository/UserProductRepository";
import { IUserProductRelationObject } from "../domain/relation/UserProductRelation";
import { CountSummaryRepositoryComponent } from "../infrastructure/db/CountSummaryRepository";
import { ICountSummaryRepository } from "../domain/repository/CountSummaryRepository";
import { DateTime } from "../../util/DateTime";
import { CountCategory, CountSummaryEntity } from "../domain/model/CountSummary";

type TPlanAchievement = {
  achievement: {
    addVocabularyListCounts: AchievementCount[],
    takeQuizCounts: AchievementCount[]
  }
}

export class AchievementCount {
  readonly userId: string
  readonly countCategory: CountCategory
  readonly date: DateTime
  readonly count: number
  constructor(
    userId: string,
    countCategory: CountCategory,
    date: DateTime,
    count: number
  ) {
    this.userId = userId
    this.countCategory = countCategory
    this.date = date
    this.count = count
  }

  static fromCountSummaryEntity(countSummaryEntity: CountSummaryEntity): AchievementCount {
    return new AchievementCount(
      countSummaryEntity.userId,
      countSummaryEntity.countCategory,
      countSummaryEntity.date,
      countSummaryEntity.count
    )
  }

  toJSON() {
    return ({
      userId: this.userId,
      countCategory: this.countCategory,
      date: this.date.toDateString(),
      count: this.count
    })
  }
}

export class PlanningApplication
  implements DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    UserActionLogHelperComponent,
    CountSummaryRepositoryComponent
  {

  readonly userId: string
  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient

  constructor(userId: string) {
    this.userId = userId
    this.dbc = this.dbClient()
    this.loggerDBC = this.loggerDBClient()
  }

  dbClient: () => IDbClient
  loggerDBClient: () => ILoggerDBClient

  userHelper: () => IUserHelper
  userActionLogger: () => IUserActionLoggerObject

  userRepository: () => IUserRepository
  userProductRepository: () => IUserProductRepository
  userProductRelation: () => IUserProductRelationObject

  countSummaryRepository: () => ICountSummaryRepository

  async getThisWeekPlanAcheivement(): Promise<TPlanAchievement> {
    const currentUser = await this.userHelper().getCurrentUser()
    const userProduct = await this.userProductRelation().toUserProduct(currentUser)

    const thisWeekDateStrings = DateTime.getThisWeekDateStrings(new DateTime())

    // did data
    // add vocabulary numbers & taking quiz numbers
    const [addVocabularyListCounts, takeQuizCounts] = await Promise.all([
      this.countSummaryRepository().countSummaryLoader().findAll(
        this.userId, CountCategory.addingVocabularyList, thisWeekDateStrings
      ),
      this.countSummaryRepository().countSummaryLoader().findAll(
        this.userId, CountCategory.takingQuiz, thisWeekDateStrings
      ),
    ])

    // TODO: plan data

    this.userActionLogger().putActionLog(
      Action.getPlanAchievement, userProduct.productId, undefined
    )

    return ({
      achievement: {
        addVocabularyListCounts: addVocabularyListCounts.map(AchievementCount.fromCountSummaryEntity),
        takeQuizCounts: takeQuizCounts.map(AchievementCount.fromCountSummaryEntity)
      }
    })
  }

}

applyMixins(
  PlanningApplication,
  [
    DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    UserActionLogHelperComponent,
    CountSummaryRepositoryComponent
  ]
)