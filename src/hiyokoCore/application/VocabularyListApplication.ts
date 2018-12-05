import { applyMixins } from "../../util/Mixin"
import { DbClientComponent } from "../infrastructure/db/client"
import { UserHelperComponent } from "./helper/UserHelper"
import { UserEntity } from "../domain/model/User"
import { IUserLoader } from "../domain/repository/UserRepository"
import { IDbClient } from "../interface/infrastructure/db"
import { VocabularyListRepository } from "../infrastructure/db/VocabularyListRepository"
import { VocabularyRepository } from "../infrastructure/db/VocabularyRepository"
import { IVocabularyListAction, IVocabularyListLoader } from "../domain/repository/VocabularyListRepository"
import { IVocabularyBootstrap, IVocabularyLoader } from "../domain/repository/VocabularyRepository"
import { VocabularyListVocabularyRelationComponent, IVocabularyListVocabularyRelationObject } from "../domain/relation/VocabularyListVocabularyRelation"
import { VocabularyListApplicationUnauthorizationError } from "./error";
import { LoggerDBClientComponent } from "../infrastructure/loggerDb/client";
import { ILoggerDBClient } from "../interface/infrastructure/LoggerDB";
import { UserActionLogHelperComponent, IUserActionLoggerObject, Action } from "./helper/UserActionLogHelper";

export class VocabularyList {
  readonly userId: string
  readonly vocaListId: number
  readonly name: string
  readonly meaning: string
  readonly contextSentence: string

  constructor(
    userId: string, vocaListId: number, name: string, meaning: string, contextSentence: string
  ) {
    this.userId = userId
    this.vocaListId = vocaListId
    this.name = name
    this.meaning = meaning
    this.contextSentence = contextSentence
  }
}

export class VocabularyListApplication
  implements DbClientComponent,
    LoggerDBClientComponent,
    UserHelperComponent,
    VocabularyListVocabularyRelationComponent,
    VocabularyListRepository,
    VocabularyRepository,
    UserActionLogHelperComponent
  {
    readonly dbc: IDbClient
    readonly loggerDBC: ILoggerDBClient
    readonly vocabularyListVocabularyRelationObject: IVocabularyListVocabularyRelationObject
    userId: string

    dbClient: () => IDbClient
    loggerDBClient: () => ILoggerDBClient

    getCurrentUser: () => Promise<UserEntity>
    userBootstrap: () => null
    userLoader: () => IUserLoader

    vocabularyListVocabularyRelation: () => IVocabularyListVocabularyRelationObject

    vocabularyListLoader: () => IVocabularyListLoader
    vocabularyListAction: () => IVocabularyListAction

    vocabularyBootstrap: () => IVocabularyBootstrap
    vocabularyLoader: () => IVocabularyLoader

    userActionLogger: () => IUserActionLoggerObject

    constructor(userId: string) {
      this.dbc = this.dbClient()
      this.loggerDBC = this.loggerDBClient()
      this.userId = userId
    }

    async addVocabularyToList(name: string, meaning: string, contextSentence?: string): Promise<VocabularyList> {
      try {
        const user = await this.getCurrentUser()

        const vocabulary = await this.vocabularyBootstrap().findOrCreate(name)
        const vocabularyList = await this.vocabularyListAction().create(
          user, vocabulary, meaning, contextSentence
        )

        // FIXME: input productId later
        await this.userActionLogger().putActionLog(
          Action.addVocabularyList, 1, vocabularyList.toLogObject()
        )

        return new VocabularyList(
          user.userId,
          vocabularyList.vocaListId,
          vocabulary.name,
          vocabularyList.meaning,
          vocabularyList.contextSentence
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
        const user = await this.getCurrentUser()

        const vocabularyListEntities = await this.vocabularyListLoader().findAllByUser(user)
        const vocabularyLists = await this.vocabularyListVocabularyRelation().mergeVocabulary(vocabularyListEntities)

        this.userActionLogger().putActionLog(
          Action.readVocabularyLists, 1
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
        const user = await this.getCurrentUser()

        const vocabularyList = await this.vocabularyListLoader().find(vocaListId)

        if (vocabularyList.userId === user.userId) {
          await this.vocabularyListAction().delete(vocaListId)
        } else {
          throw new VocabularyListApplicationUnauthorizationError(`Delete vocabularyList not authorized`)
        }

        // ensure delete log is put
        await this.userActionLogger().putActionLog(
          Action.deleteVocabularyList, 1, vocabularyList.toLogObject()
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
    VocabularyListRepository,
    VocabularyRepository,
    UserActionLogHelperComponent
  ]
)
