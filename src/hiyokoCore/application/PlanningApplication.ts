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
import { DateTime, DateString } from "../../util/DateTime";
import { CountCategory, CountSummaryEntity } from "../domain/model/CountSummary";

export class PlanAchievement {
  private achievementKeys: string[]
  private achievement: { [key: string]: CountAchievement[] }
  private planKeys: string[]
  private plan: { [key: string]: CountPlan[] }

  constructor() {
    this.achievementKeys = []
    this.achievement = {}
    this.planKeys = []
    this.plan = {}
  }

  setAchievementCount(key: string, achievementCounts: CountAchievement[]): PlanAchievement {
    this.achievementKeys.push(key)
    this.achievement[key] = [...achievementCounts]

    return this
  }

  setPlanCount(key: string, planCounts: CountPlan[]): PlanAchievement {
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

  static fromCountSummaryEntity(countSummaryEntity: CountSummaryEntity): CountSummary {
    return new CountSummary(
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

  toCountSummaryEntity(): CountSummaryEntity {
    return new CountSummaryEntity(
      this.userId,
      this.countCategory,
      this.date,
      this.count
    )
  }
}

export class CountAchievement extends CountSummary {}

export class CountPlan extends CountSummary {}

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

  async getThisWeekPlanAchievement(): Promise<PlanAchievement> {
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
    planAchievement.setAchievementCount(CountCategory.addingVocabularyList, addVocabularyListCounts.map(CountAchievement.fromCountSummaryEntity))
      .setAchievementCount(CountCategory.takingQuiz, takeQuizCounts.map(CountAchievement.fromCountSummaryEntity))
      .setPlanCount(CountCategory.planAddingVocabularyList, planAddVocabularyListCounts.map(CountPlan.fromCountSummaryEntity))
      .setPlanCount(CountCategory.planTakingQuiz, planTakeQuizCounts.map(CountPlan.fromCountSummaryEntity))

    return planAchievement
  }

  async setCountPlans(countPlans: CountPlan[]): Promise<void> {
    const currentUser = await this.userHelper().getCurrentUser()
    const userProduct = await this.userProductRelation().toUserProduct(currentUser)

    await this.countSummaryRepository().countSummaryAction().bulkCreateOrUpdate(
      countPlans.map(countPlan => countPlan.toCountSummaryEntity())
    )

    this.userActionLogger().putActionLog(
      Action.setPlanAchievement, userProduct.productId, countPlans
    )
  }

  async adminGetCountPlansByUserIdsAndCountCategoryAndDate(
    userIds: string[],
    countCategory: CountCategory,
    dateString: DateString
  ): Promise<{ userId: string, countSummary: CountSummaryEntity }[]> {
    const countSummaries = await this.countSummaryRepository().countSummaryLoader().findAllByCountCategoryAndUserIdsAndDate(
      userIds, countCategory, dateString
    )

    const countPlanUserIdMap: { [key: string]: CountSummaryEntity } = countSummaries.reduce((acc, countSummary) => {
      acc[countSummary.userId] = countSummary
      return acc
    }, {})

    const result = userIds.map(userId => {
      if (countPlanUserIdMap[userId]) {
        return ({
          userId,
          countSummary: countPlanUserIdMap[userId]
        })
      }
      return ({
        userId,
        countSummary: null
      })
    })

    return result
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