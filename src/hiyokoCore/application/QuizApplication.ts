import { DbClientComponent } from "../infrastructure/db/client";
import { applyMixins } from "../../util/Mixin";
import { IDbClient } from "../interface/infrastructure/db";
import { LoggerDBClientComponent } from "../infrastructure/loggerDb/client";
import { UserHelperComponent } from "./helper/UserHelper";
import { ILoggerDBClient } from "../interface/infrastructure/LoggerDB";
import { IUserLoader } from "../domain/repository/UserRepository";
import { IUserProductRepository } from "../domain/repository/UserProductRepository";
import { IUserProductRelationObject } from "../domain/relation/UserProductRelation";
import { UserEntity, UserProductEntity } from "../domain/model/User";
import { VocabularyListRepository } from "../infrastructure/db/VocabularyListRepository";
import { IVocabularyListLoader, IVocabularyListAction } from "../domain/repository/VocabularyListRepository";
import { VocabularyListVocabularyRelationComponent, IVocabularyListVocabularyRelationObject } from "../domain/relation/VocabularyListVocabularyRelation";
import { VocabularyRepository } from "../infrastructure/db/VocabularyRepository";
import { IVocabularyBootstrap, IVocabularyLoader } from "../domain/repository/VocabularyRepository";
import { IUserActionLoggerObject, UserActionLogHelperComponent, Action } from "./helper/UserActionLogHelper";
import { VocabularyList } from "./VocabularyListApplication";

export class SimpleQuiz {
  readonly problem: string
  readonly answer: string

  constructor(problem: string, answer: string) {
    this.problem = problem
    this.answer = answer
  }
}

export class QuizApplication
  implements DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    UserActionLogHelperComponent,
    VocabularyListRepository,
    VocabularyRepository,
    VocabularyListVocabularyRelationComponent
  {

  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient
  readonly userId: string

  dbClient: () => IDbClient
  loggerDBClient: () => ILoggerDBClient

  getCurrentUser: () => Promise<UserEntity>
  getCurrentUserProduct: (userEntity: UserEntity) => Promise<UserProductEntity>

  userBootstrap: () => null
  userLoader: () => IUserLoader

  userProductRepository: () => IUserProductRepository
  userProductRelation: () => IUserProductRelationObject

  vocabularyListVocabularyRelation: () => IVocabularyListVocabularyRelationObject

  vocabularyBootstrap: () => IVocabularyBootstrap
  vocabularyLoader: () => IVocabularyLoader

  vocabularyListLoader: () => IVocabularyListLoader
  vocabularyListAction: () => IVocabularyListAction

  userActionLogger: () => IUserActionLoggerObject

  constructor(userId: string) {
    this.dbc = this.dbClient()
    this.loggerDBC = this.loggerDBClient()
    this.userId = userId
  }

  async getSimpleQuizzes(): Promise<SimpleQuiz[]> {
    const currentUser = await this.getCurrentUser()
    const userProduct = await this.userProductRelation().toUserProduct(currentUser)

    const vocabularyListsWithTopPriority = await this.vocabularyListLoader().findByUserWithPriorityCreatedAt(
      currentUser
    )

    const vocabularyListsVocabularyWithTopPriority: VocabularyList[] = <VocabularyList[]> await this.vocabularyListVocabularyRelation().mergeVocabulary(
      vocabularyListsWithTopPriority
    )

    this.userActionLogger().putActionLog(
      Action.getSimpleQuizzes, userProduct.productId, vocabularyListsVocabularyWithTopPriority
    )

    return vocabularyListsVocabularyWithTopPriority.map(
      vocabularyList => new SimpleQuiz(vocabularyList.meaning, vocabularyList.name)
    )
  }
}

applyMixins(
  QuizApplication,
  [
    DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    UserActionLogHelperComponent,
    VocabularyListRepository,
    VocabularyRepository,
    VocabularyListVocabularyRelationComponent
  ]
)