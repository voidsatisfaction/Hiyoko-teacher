import { DbClientComponent } from "../infrastructure/db/client";
import { applyMixins } from "../../util/Mixin";
import { IDbClient } from "../interface/infrastructure/db";
import { LoggerDBClientComponent } from "../infrastructure/loggerDb/client";
import { UserHelperComponent, IUserHelper } from "./helper/UserHelper";
import { ILoggerDBClient } from "../interface/infrastructure/LoggerDB";
import { IUserRepository } from "../domain/repository/UserRepository";
import { IUserProductRepository } from "../domain/repository/UserProductRepository";
import { IUserProductRelationObject } from "../domain/relation/UserProductRelation";
import { VocabularyListRepositoryComponent } from "../infrastructure/db/VocabularyListRepository";
import { IVocabularyListRepository } from "../domain/repository/VocabularyListRepository";
import { VocabularyListVocabularyRelationComponent, IVocabularyListVocabularyRelationObject } from "../domain/relation/VocabularyListVocabularyRelation";
import { VocabularyRepositoryComponent } from "../infrastructure/db/VocabularyRepository";
import { IVocabularyRepository } from "../domain/repository/VocabularyRepository";
import { IUserActionLoggerObject, UserActionLogHelperComponent, Action } from "./helper/UserActionLogHelper";
import { VocabularyList } from "./VocabularyListApplication";

export abstract class Quiz {
  abstract readonly vocaListId: number
  abstract readonly problem: string
  abstract readonly answer: string
}

export class SimpleQuiz extends Quiz {
  readonly vocaListId: number
  readonly problem: string
  readonly answer: string

  constructor(vocaListId: number, problem: string, answer: string) {
    super()
    this.vocaListId = vocaListId
    this.problem = problem
    this.answer = answer
  }
}

export class ActiveVocabularyQuiz extends Quiz {
  readonly vocaListId: number
  readonly problem: string
  readonly answer: string

  constructor(vocaListId: number, problem: string, answer: string) {
    super()
    this.vocaListId = vocaListId
    this.problem = problem
    this.answer = answer
  }
}

export class QuizApplication
  implements DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    UserActionLogHelperComponent,
    VocabularyListRepositoryComponent,
    VocabularyRepositoryComponent,
    VocabularyListVocabularyRelationComponent
  {

  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient
  readonly userId: string

  dbClient: () => IDbClient
  loggerDBClient: () => ILoggerDBClient

  userHelper: () => IUserHelper

  userRepository: () => IUserRepository
  userProductRepository: () => IUserProductRepository
  userProductRelation: () => IUserProductRelationObject

  vocabularyListVocabularyRelation: () => IVocabularyListVocabularyRelationObject
  vocabularyRepository: () => IVocabularyRepository
  vocabularyListRepository: () => IVocabularyListRepository

  userActionLogger: () => IUserActionLoggerObject

  constructor(userId: string) {
    this.dbc = this.dbClient()
    this.loggerDBC = this.loggerDBClient()
    this.userId = userId
  }

  async getSimpleQuizzes(): Promise<SimpleQuiz[]> {
    const currentUser = await this.userHelper().getCurrentUser()
    const userProduct = await this.userProductRelation().toUserProduct(currentUser)

    const vocabularyListsWithTopPriority = await this.vocabularyListRepository().vocabularyListLoader().findByUserWithPriorityCreatedAt(
      currentUser
    )

    const vocabularyListsVocabularyWithTopPriority: VocabularyList[] = <VocabularyList[]> await this.vocabularyListVocabularyRelation().mergeVocabulary(
      vocabularyListsWithTopPriority
    )

    this.userActionLogger().putActionLog(
      Action.getSimpleQuizzes, userProduct.productId, vocabularyListsVocabularyWithTopPriority
    )

    return vocabularyListsVocabularyWithTopPriority.map(
      vocabularyList => new SimpleQuiz(vocabularyList.vocaListId, vocabularyList.meaning, vocabularyList.name)
    )
  }

  async createCompositeQuizzes(): Promise<Quiz[]> {
    const NUMBER_OF_SIMPLE_VOCA_QUIZZESS = 3
    const NUMBER_OF_ACTIVE_VOCA_QUIZZESS = 3

    const currentUser = await this.userHelper().getCurrentUser()
    const userProduct = await this.userProductRelation().toUserProduct(currentUser)

    const vocabularyListsWithTopPriority = await this.vocabularyListRepository().vocabularyListLoader().findByUserWithPriorityCreatedAt(
      currentUser
    )

    const vocabularyListsVocabularyWithTopPriority: VocabularyList[] = <VocabularyList[]>await this.vocabularyListVocabularyRelation().mergeVocabulary(
      vocabularyListsWithTopPriority
    )

    const simpleQuizzesSection = vocabularyListsVocabularyWithTopPriority.slice(0, NUMBER_OF_ACTIVE_VOCA_QUIZZESS)
    const activeVocaQuizzesSection = vocabularyListsVocabularyWithTopPriority.slice(NUMBER_OF_SIMPLE_VOCA_QUIZZESS, NUMBER_OF_ACTIVE_VOCA_QUIZZESS + NUMBER_OF_SIMPLE_VOCA_QUIZZESS)

    const simpleQuizzes = simpleQuizzesSection.map(
      vocabularyList => new SimpleQuiz(vocabularyList.vocaListId, vocabularyList.meaning, vocabularyList.name)
    )

    const activeVocaQuizzes = activeVocaQuizzesSection.map(vl => {
      const convertedActiveVocabularyQuiz = this.vocabularyListToActiveVocabularyQuiz(vl)

      return new ActiveVocabularyQuiz(
        vl.vocaListId,
        convertedActiveVocabularyQuiz.problem,
        convertedActiveVocabularyQuiz.answer
      )
    })

    this.userActionLogger().putActionLog(
      Action.getCompositeQuizzes, userProduct.productId, vocabularyListsVocabularyWithTopPriority
    )

    return <Quiz[]>[...simpleQuizzes, ...activeVocaQuizzes]
  }

  // e.g you guys turned down my offer right? -> you guys tu____ ____ my offer right? / rned down
  private vocabularyListToActiveVocabularyQuiz(vocabularyList: VocabularyList): { problem: string, answer: string } {
    const name = vocabularyList.name
    const contextSentence = vocabularyList.contextSentence
    const nameSplit = name.split(' ')

    let answer = ''

    const replacingString = nameSplit.map((str, i) => {
      if (i > 0) {
        answer += ' '
        return str.split('').map((c) => {
          answer += c
          return '_'
        }).join('')
      }
      let noTouchUntil = 0
      if (str.length <= 1) {
        return '_'
      } else if (str.length <= 3) {
        noTouchUntil = 0
      } else if (str.length <= 6) {
        noTouchUntil = 1
      } else if (str.length <= 9) {
        noTouchUntil = 2
      } else {
        noTouchUntil = 3
      }

      return str.split('').map((c, i) => {
        if (i <= noTouchUntil) {
          return c
        }
        answer += c
        return '_'
      }).join('')
    })
    .join(' ')

    const problem = contextSentence.replace(name, replacingString)

    return { problem, answer }
  }
}

applyMixins(
  QuizApplication,
  [
    DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    UserActionLogHelperComponent,
    VocabularyListRepositoryComponent,
    VocabularyRepositoryComponent,
    VocabularyListVocabularyRelationComponent
  ]
)