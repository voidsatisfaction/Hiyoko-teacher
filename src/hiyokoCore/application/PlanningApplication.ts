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

export class PlanAchievement {
  private achievementKeys: string[]
  private achievement: { [key: string]: AchievementCount[] }
  private planKeys: string[]
  private plan: { [key: string]: PlanCount[] }

  constructor() {
    this.achievementKeys = []
    this.achievement = {}
    this.planKeys = []
    this.plan = {}
  }

  setAchievementCount(key: string, achievementCounts: AchievementCount[]): PlanAchievement {
    this.achievementKeys.push(key)
    this.achievement[key] = [...achievementCounts]

    return this
  }

  setPlanCount(key: string, planCounts: PlanCount[]): PlanAchievement {
    this.planKeys.push(key)
    this.plan[key] = [...planCounts]

    return this
  }

  toJSON() {
    const results = {
      achievement: {},
      plan: {}
    }

    this.achievementKeys.forEach(achievementKey => {
      results.achievement[achievementKey] = this.achievement[achievementKey].map(achievementCount => achievementCount.toJSON())
    })
    this.planKeys.forEach(planKey => {
      results.plan[planKey] = this.plan[planKey].map(planCount => planCount.toJSON())
    })

    return results
  }
}

export class CountSummary {
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

export class AchievementCount extends CountSummary {}

export class PlanCount extends CountSummary {}

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

  async getThisWeekPlanAcheivement(): Promise<PlanAchievement> {
    const currentUser = await this.userHelper().getCurrentUser()
    const userProduct = await this.userProductRelation().toUserProduct(currentUser)

    const thisWeekDateStrings = DateTime.getThisWeekDateStrings(new DateTime())

    // did data
    // add vocabulary numbers & taking quiz numbers
    const [
      addVocabularyListCounts,
      takeQuizCounts,
      planAddVocabularyListCounts,
      planTakeQuizCounts
    ] = await Promise.all([
      this.countSummaryRepository().countSummaryLoader().findAll(
        this.userId, CountCategory.addingVocabularyList, thisWeekDateStrings
      ),
      this.countSummaryRepository().countSummaryLoader().findAll(
        this.userId, CountCategory.takingQuiz, thisWeekDateStrings
      ),
      this.countSummaryRepository().countSummaryLoader().findAll(
        this.userId, CountCategory.planAddingVocabularyList, thisWeekDateStrings
      ),
      this.countSummaryRepository().countSummaryLoader().findAll(
        this.userId, CountCategory.planTakingQuiz, thisWeekDateStrings
      )
    ])

    this.userActionLogger().putActionLog(
      Action.getPlanAchievement, userProduct.productId, undefined
    )

    const planAchievement = new PlanAchievement()
    planAchievement.setAchievementCount(CountCategory.addingVocabularyList, addVocabularyListCounts.map(AchievementCount.fromCountSummaryEntity))
      .setAchievementCount(CountCategory.takingQuiz, takeQuizCounts.map(AchievementCount.fromCountSummaryEntity))
      .setPlanCount(CountCategory.planAddingVocabularyList, planAddVocabularyListCounts.map(PlanCount.fromCountSummaryEntity))
      .setPlanCount(CountCategory.planTakingQuiz, planTakeQuizCounts.map(PlanCount.fromCountSummaryEntity))

    return planAchievement
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