import { applyMixins } from "../../util/Mixin";
import { DbClientComponent } from "../infrastructure/db/client";
import { IDbClient } from "../interface/infrastructure/db";
import { LoggerDBClientComponent } from "../infrastructure/loggerDb/client";
import { ILoggerDBClient } from "../interface/infrastructure/LoggerDB";
import { UserHelperComponent, IUserHelper } from "./helper/UserHelper";
import { IUserRepository } from "../domain/repository/UserRepository";
import { IUserProductRepository } from "../domain/repository/UserProductRepository";
import { IUserProductRelationObject } from "../domain/relation/UserProductRelation";
import { VocabularyListRepositoryComponent } from "../infrastructure/db/VocabularyListRepository";
import { IVocabularyListRepository } from "../domain/repository/VocabularyListRepository";
import { SimpleQuiz, Quiz } from "./QuizApplication";
import { VocabularyListEntity } from "../domain/model/VocabularyList";
import { UserActionLogHelperComponent, IUserActionLoggerObject, Action } from "./helper/UserActionLogHelper";
import { UserEntity, UserProductEntity } from "../domain/model/User";
import { CountSummaryRepositoryComponent } from "../infrastructure/db/CountSummaryRepository";
import { ICountSummaryRepository } from "../domain/repository/CountSummaryRepository";
import { CountCategory } from "../domain/model/CountSummary";
import { DateTime } from "../../util/DateTime";

export interface IQuizResult<Q> {
  total: number
  correct: number
  incorrect: number
  detail: {
    quiz: Q,
    correct: boolean
  }[]
}

export class QuizResult<Q> {
  readonly total: number
  readonly correct: number
  readonly incorrect: number
  readonly detail: {
    quiz: Q,
    correct: boolean
  }[]

  constructor(
    total: number,
    correct: number,
    incorrect: number,
    detail: {
      quiz: Q,
      correct: boolean
    }[]
  ) {
    this.total = total
    this.correct = correct
    this.incorrect = incorrect
    this.detail = detail
  }
}

export class QuizResultApplication
  implements DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    UserActionLogHelperComponent,
    CountSummaryRepositoryComponent,
    VocabularyListRepositoryComponent
  {

  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient
  readonly userId: string

  dbClient: () => IDbClient
  loggerDBClient: () => ILoggerDBClient

  userHelper: () => IUserHelper
  userActionLogger: () => IUserActionLoggerObject

  userRepository: () => IUserRepository
  userProductRepository: () => IUserProductRepository
  userProductRelation: () => IUserProductRelationObject

  countSummaryRepository: () => ICountSummaryRepository

  vocabularyListRepository: () => IVocabularyListRepository

  constructor(userId: string) {
    this.userId = userId
    this.dbc = this.dbClient()
    this.loggerDBC = this.loggerDBClient()
  }

  async updateSimpleQuizResult(simpleQuizResult: QuizResult<SimpleQuiz>): Promise<void> {
    const user: UserEntity = await this.userHelper().getCurrentUser()
    const userProduct: UserProductEntity = await this.userProductRelation().toUserProduct(user)

    const correctVocaListIds = simpleQuizResult.detail.filter(d => d.correct).map(d => d.quiz.vocaListId)
    const incorrectVocabularyListIds = simpleQuizResult.detail.filter(d => !d.correct).map(d => d.quiz.vocaListId)

    // TODO: merge two query
    const [correctVocabularyLists, incorrectVocabularyLists] = await Promise.all([
      this.vocabularyListRepository().vocabularyListLoader().findAll(correctVocaListIds),
      this.vocabularyListRepository().vocabularyListLoader().findAll(incorrectVocabularyListIds),
    ])

    const updatedCorrectVocabularyLists = correctVocabularyLists.map(vl => {
      const nextPriority = this.calculateCorrectNextPriority(vl.priority)
      return new VocabularyListEntity(
        vl.vocaListId, vl.userId, vl.vocaId, vl.meaning, nextPriority, vl.createdAt, vl.contextSentence
      )
    })

    const updatedIncorrectVocabularyLists = incorrectVocabularyLists.map(vl => {
      const nextPriority = this.calculateIncorrectNextPriority(vl.priority)
      return new VocabularyListEntity(
        vl.vocaListId, vl.userId, vl.vocaId, vl.meaning, nextPriority, vl.createdAt, vl.contextSentence
      )
    })

    const updatedVocabularyLists = [...updatedCorrectVocabularyLists, ...updatedIncorrectVocabularyLists]

    // FIXME: performance issue, bulk update
    await Promise.all(
      updatedVocabularyLists.map(vl => this.vocabularyListRepository().vocabularyListAction().update(vl))
    )

    await this.countSummaryRepository().countSummaryAction().createOrUpdate(user, CountCategory.takingQuiz, new DateTime())

    this.userActionLogger().putActionLog(
      Action.solveSimpleQuizzes, userProduct.productId, simpleQuizResult
    )
  }

  async updateCompositeQuizResult(quizResult: QuizResult<Quiz>): Promise<void> {
    const user: UserEntity = await this.userHelper().getCurrentUser()
    const userProduct: UserProductEntity = await this.userProductRelation().toUserProduct(user)

    const correctVocaListIds = quizResult.detail.filter(d => d.correct).map(d => d.quiz.vocaListId)
    const incorrectVocabularyListIds = quizResult.detail.filter(d => !d.correct).map(d => d.quiz.vocaListId)

    // TODO: merge two query
    const [correctVocabularyLists, incorrectVocabularyLists] = await Promise.all([
      this.vocabularyListRepository().vocabularyListLoader().findAll(correctVocaListIds),
      this.vocabularyListRepository().vocabularyListLoader().findAll(incorrectVocabularyListIds),
    ])

    const updatedCorrectVocabularyLists = correctVocabularyLists.map(vl => {
      const nextPriority = this.calculateCorrectNextPriority(vl.priority)
      return new VocabularyListEntity(
        vl.vocaListId, vl.userId, vl.vocaId, vl.meaning, nextPriority, vl.createdAt, vl.contextSentence
      )
    })

    const updatedIncorrectVocabularyLists = incorrectVocabularyLists.map(vl => {
      const nextPriority = this.calculateIncorrectNextPriority(vl.priority)
      return new VocabularyListEntity(
        vl.vocaListId, vl.userId, vl.vocaId, vl.meaning, nextPriority, vl.createdAt, vl.contextSentence
      )
    })

    const updatedVocabularyLists = [...updatedCorrectVocabularyLists, ...updatedIncorrectVocabularyLists]

    // FIXME: performance issue, bulk update
    await Promise.all(
      updatedVocabularyLists.map(vl => this.vocabularyListRepository().vocabularyListAction().update(vl))
    )

    await this.countSummaryRepository().countSummaryAction().createOrUpdate(user, CountCategory.takingQuiz, new DateTime())

    this.userActionLogger().putActionLog(
      Action.solveCompositeQuizzes, userProduct.productId, quizResult
    )
  }

  private calculateCorrectNextPriority(priority: number): number {
    return (priority + 0) / 2
  }

  private calculateIncorrectNextPriority(priority: number): number {
    return (priority + 100) / 2
  }
}

applyMixins(
  QuizResultApplication,
  [
    DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    UserActionLogHelperComponent,
    CountSummaryRepositoryComponent,
    VocabularyListRepositoryComponent
  ]
)