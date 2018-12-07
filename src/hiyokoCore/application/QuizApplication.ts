import { DbClientComponent } from "../infrastructure/db/client";
import { applyMixins } from "../../util/Mixin";
import { IDbClient } from "../interface/infrastructure/db";
import { LoggerDBClientComponent } from "../infrastructure/loggerDb/client";
import { UserHelperComponent } from "./helper/UserHelper";
import { ILoggerDBClient } from "../interface/infrastructure/LoggerDB";
import { IUserRepository } from "../domain/repository/UserRepository";
import { IUserProductRepository } from "../domain/repository/UserProductRepository";
import { IUserProductRelationObject } from "../domain/relation/UserProductRelation";
import { UserEntity, UserProductEntity } from "../domain/model/User";
import { VocabularyListRepositoryComponent } from "../infrastructure/db/VocabularyListRepository";
import { IVocabularyListRepository } from "../domain/repository/VocabularyListRepository";
import { VocabularyListVocabularyRelationComponent, IVocabularyListVocabularyRelationObject } from "../domain/relation/VocabularyListVocabularyRelation";
import { VocabularyRepositoryComponent } from "../infrastructure/db/VocabularyRepository";
import { IVocabularyRepository } from "../domain/repository/VocabularyRepository";
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
    VocabularyListRepositoryComponent,
    VocabularyRepositoryComponent,
    VocabularyListVocabularyRelationComponent
  {

  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient
  readonly userId: string

  dbClient: () => IDbClient
  loggerDBClient: () => ILoggerDBClient

  getCurrentUser: () => Promise<UserEntity>
  getCurrentUserProduct: (userEntity: UserEntity) => Promise<UserProductEntity>

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
    const currentUser = await this.getCurrentUser()
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
    VocabularyListRepositoryComponent,
    VocabularyRepositoryComponent,
    VocabularyListVocabularyRelationComponent
  ]
)