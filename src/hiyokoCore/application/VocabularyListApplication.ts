import { applyMixins } from "../../util/Mixin"
import { DbClientComponent } from "../infrastructure/db/client"
import { UserHelperComponent, IUserHelper } from "./helper/UserHelper"
import { IUserRepository } from "../domain/repository/UserRepository"
import { IDbClient } from "../interface/infrastructure/db"
import { VocabularyListRepositoryComponent } from "../infrastructure/db/VocabularyListRepository"
import { VocabularyRepositoryComponent } from "../infrastructure/db/VocabularyRepository"
import { IVocabularyListRepository } from "../domain/repository/VocabularyListRepository"
import { IVocabularyRepository } from "../domain/repository/VocabularyRepository"
import { VocabularyListVocabularyRelationComponent, IVocabularyListVocabularyRelationObject } from "../domain/relation/VocabularyListVocabularyRelation"
import { VocabularyListApplicationUnauthorizationError } from "./error";
import { LoggerDBClientComponent } from "../infrastructure/loggerDb/client";
import { ILoggerDBClient } from "../interface/infrastructure/LoggerDB";
import { UserActionLogHelperComponent, IUserActionLoggerObject, Action } from "./helper/UserActionLogHelper";
import { IUserProductRepository } from "../domain/repository/UserProductRepository";
import { IUserProductRelationObject } from "../domain/relation/UserProductRelation";

export class VocabularyList {
  readonly userId: string
  readonly vocaListId: number
  readonly name: string
  readonly meaning: string
  readonly contextSentence: string
  readonly priority: number

  constructor(
    userId: string,
    vocaListId: number,
    name: string,
    meaning: string,
    contextSentence: string,
    priority: number
  ) {
    this.userId = userId
    this.vocaListId = vocaListId
    this.name = name
    this.meaning = meaning
    this.contextSentence = contextSentence
    this.priority = priority
  }
}

export class VocabularyListApplication
  implements DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    VocabularyListVocabularyRelationComponent,
    VocabularyListRepositoryComponent,
    VocabularyRepositoryComponent,
    UserActionLogHelperComponent
  {
    readonly dbc: IDbClient
    readonly loggerDBC: ILoggerDBClient
    readonly vocabularyListVocabularyRelationObject: IVocabularyListVocabularyRelationObject
    userId: string

    dbClient: () => IDbClient
    loggerDBClient: () => ILoggerDBClient

    userHelper: () => IUserHelper

    userRepository: () => IUserRepository

    vocabularyListVocabularyRelation: () => IVocabularyListVocabularyRelationObject

    vocabularyListRepository: () => IVocabularyListRepository

    vocabularyRepository: () => IVocabularyRepository

    userProductRepository: () => IUserProductRepository
    userProductRelation: () => IUserProductRelationObject

    userActionLogger: () => IUserActionLoggerObject

    constructor(userId: string) {
      this.dbc = this.dbClient()
      this.loggerDBC = this.loggerDBClient()
      this.userId = userId
    }

    async addVocabularyToList(name: string, meaning: string, contextSentence?: string): Promise<VocabularyList> {
      try {
        const user = await this.userHelper().getCurrentUser()
        const userProduct = await this.userHelper().getCurrentUserProduct(user)

        const vocabulary = await this.vocabularyRepository().vocabularyBootstrap().findOrCreate(name)
        const vocabularyList = await this.vocabularyListRepository().vocabularyListAction().create(
          user, vocabulary, meaning, contextSentence
        )

        this.userActionLogger().putActionLog(
          Action.addVocabularyList, userProduct.productId, vocabularyList.toLogObject()
        )

        return new VocabularyList(
          user.userId,
          vocabularyList.vocaListId,
          vocabulary.name,
          vocabularyList.meaning,
          vocabularyList.contextSentence,
          vocabularyList.priority
        )
      } catch(e) {
        throw e
      } finally {
        await this.dbc.close()
      }
    }

    // TODO: add pagination
    async getUserVocabularyLists(): Promise<VocabularyList[]> {
      try {
        const user = await this.userHelper().getCurrentUser()
        const userProduct = await this.userHelper().getCurrentUserProduct(user)

        const vocabularyListEntities = await this.vocabularyListRepository().vocabularyListLoader().findAllByUser(user)
        const vocabularyLists = <VocabularyList[]>await this.vocabularyListVocabularyRelation().mergeVocabulary(vocabularyListEntities)

        this.userActionLogger().putActionLog(
          Action.readVocabularyLists, userProduct.productId
        )

        return vocabularyLists
      } catch(e) {
        throw e
      } finally {
        await this.dbc.close()
      }
    }

    async deleteVocabularyList(vocaListId: number): Promise<void> {
      try {
        const user = await this.userHelper().getCurrentUser()
        const userProduct = await this.userHelper().getCurrentUserProduct(user)

        const vocabularyList = await this.vocabularyListRepository().vocabularyListLoader().find(vocaListId)

        if (vocabularyList.userId === user.userId) {
          await this.vocabularyListRepository().vocabularyListAction().delete(vocaListId)
        } else {
          throw new VocabularyListApplicationUnauthorizationError(`Delete vocabularyList not authorized`)
        }

        this.userActionLogger().putActionLog(
          Action.deleteVocabularyList, userProduct.productId, vocabularyList.toLogObject()
        )

      } catch(e) {
        throw e
      } finally {
        await this.dbc.close()
      }
    }
}

applyMixins(
  VocabularyListApplication,
  [
    DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    VocabularyListVocabularyRelationComponent,
    VocabularyListRepositoryComponent,
    VocabularyRepositoryComponent,
    UserActionLogHelperComponent
  ]
)
