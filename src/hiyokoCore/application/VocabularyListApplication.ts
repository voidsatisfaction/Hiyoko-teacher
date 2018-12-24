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
import { DateTime } from "../../util/DateTime";
import { VocabularyListEntity } from "../domain/model/VocabularyList";

export class VocabularyList {
  readonly userId: string
  readonly vocaListId: number
  readonly vocaId: number
  readonly name: string
  readonly meaning: string
  readonly contextSentence: string
  readonly priority: number
  readonly createdAt: DateTime

  static fromVocabularyListEntityAndName(
    vocabularyListEntity: VocabularyListEntity,
    name: string
  ): VocabularyList {
    return new VocabularyList(
      vocabularyListEntity.userId,
      vocabularyListEntity.vocaListId,
      vocabularyListEntity.vocaId,
      name,
      vocabularyListEntity.meaning,
      vocabularyListEntity.contextSentence,
      vocabularyListEntity.priority,
      vocabularyListEntity.createdAt
    )
  }

  constructor(
    userId: string,
    vocaListId: number,
    vocaId: number,
    name: string,
    meaning: string,
    contextSentence: string,
    priority: number,
    createdAt: DateTime
  ) {
    this.userId = userId
    this.vocaListId = vocaListId
    this.vocaId = vocaId
    this.name = name
    this.meaning = meaning
    this.contextSentence = contextSentence
    this.priority = priority
    this.createdAt = createdAt
  }

  toJSON() {
    return ({
      userId: this.userId,
      vocaListId: this.vocaListId,
      name: this.name,
      meaning: this.meaning,
      contextSentence: this.contextSentence,
      priority: this.priority,
      createdAt: this.createdAt.toDateTimeString()
    })
  }

  toVocabularyListEntity(): VocabularyListEntity {
    return new VocabularyListEntity(
      this.vocaListId,
      this.userId,
      this.vocaId,
      this.meaning,
      this.priority,
      this.createdAt,
      this.contextSentence,
      null
    )
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
          Action.addVocabularyList, userProduct.productId, vocabularyList.toJSON()
        )

        return new VocabularyList(
          user.userId,
          vocabularyList.vocaListId,
          vocabularyList.vocaId,
          vocabulary.name,
          vocabularyList.meaning,
          vocabularyList.contextSentence,
          vocabularyList.priority,
          vocabularyList.createdAt
        )
      } catch(e) {
        throw e
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

        return vocabularyLists.map(
          vl => new VocabularyList(
            vl.userId, vl.vocaListId, vl.vocaId, vl.name, vl.meaning, vl.contextSentence, vl.priority, vl.createdAt
          )
        )
      } catch(e) {
        throw e
      }
    }

    async editUserVocabularyList(
      vocaListId: number,
      meaning: string,
      contextSentence?: string
    ): Promise<VocabularyList> {
      try {
        const user = await this.userHelper().getCurrentUser()
        const userProduct = await this.userHelper().getCurrentUserProduct(user)

        const oldVocabularyListEntity = await this.vocabularyListRepository().vocabularyListLoader().find(vocaListId)
        contextSentence = contextSentence || oldVocabularyListEntity.contextSentence

        if (oldVocabularyListEntity.userId !== user.userId) {
          throw new VocabularyListApplicationUnauthorizationError(`Edit vocabularyList not authorized`)
        }
        const newVocabularyListEntity = new VocabularyListEntity(
          oldVocabularyListEntity.vocaListId, oldVocabularyListEntity.userId, oldVocabularyListEntity.vocaId,
          meaning, oldVocabularyListEntity.priority, oldVocabularyListEntity.createdAt, contextSentence
        )

        await this.vocabularyListRepository().vocabularyListAction().update(newVocabularyListEntity)
        const newVocabularyLists = <VocabularyList[]>await this.vocabularyListVocabularyRelation().mergeVocabulary([newVocabularyListEntity])

        this.userActionLogger().putActionLog(
          Action.edditVocabularyList, userProduct.productId
        )

        return VocabularyList.fromVocabularyListEntityAndName(
          newVocabularyListEntity,
          newVocabularyLists[0].name
        )
      } catch(e) {
        throw e
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
          Action.deleteVocabularyList, userProduct.productId, vocabularyList.toJSON()
        )

      } catch(e) {
        throw e
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
