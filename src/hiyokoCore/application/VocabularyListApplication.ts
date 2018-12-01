import { applyMixins } from "../../util/Mixin"
import { DbClientComponent } from "../infrastructure/db/client"
import { UserHelperComponent } from "./helper/UserHelper"
import { UserEntity } from "../domain/model/User"
import { IUserBootstrap, IUserLoader } from "../domain/repository/UserRepository"
import { IDbClient } from "../interface/infrastructure/db"
import { VocabularyListRepository } from "../infrastructure/db/VocabularyListRepository"
import { VocabularyRepository } from "../infrastructure/db/VocabularyRepository"
import { IVocabularyListAction, IVocabularyListLoader } from "../domain/repository/VocabularyListRepository"
import { IVocabularyBootstrap, IVocabularyLoader } from "../domain/repository/VocabularyRepository"
import { VocabularyListVocabularyRelationComponent, IVocabularyListVocabularyRelationObject } from "../domain/relation/VocabularyListVocabularyRelation"

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
    UserHelperComponent,
    VocabularyListVocabularyRelationComponent,
    VocabularyListRepository,
    VocabularyRepository
  {
    readonly dbc: IDbClient
    readonly vocabularyListVocabularyRelationObject: IVocabularyListVocabularyRelationObject
    userId: string

    dbClient: () => IDbClient

    getCurrentUser: () => Promise<UserEntity>
    userBootstrap: () => null
    userLoader: () => IUserLoader

    vocabularyListVocabularyRelation: () => IVocabularyListVocabularyRelationObject

    vocabularyListLoader: () => IVocabularyListLoader
    vocabularyListAction: () => IVocabularyListAction

    vocabularyBootstrap: () => IVocabularyBootstrap
    vocabularyLoader: () => IVocabularyLoader

    constructor(userId: string) {
      this.dbc = this.dbClient()
      this.userId = userId
    }

    async addVocabularyToList(name: string, meaning: string, contextSentence?: string): Promise<VocabularyList> {
      const user = await this.getCurrentUser()

      const vocabulary = await this.vocabularyBootstrap().findOrCreate(name)
      const vocabularyList = await this.vocabularyListAction().create(
        user, vocabulary, meaning, contextSentence
      )

      return new VocabularyList(
        user.userId,
        vocabulary.vocaId,
        vocabulary.name,
        vocabularyList.meaning,
        vocabularyList.contextSentence
      )
    }

    // TODO: add pagination
    async getUserVocabularyLists(): Promise<VocabularyList[]> {
      const user = await this.getCurrentUser()

      const vocabularyListEntities = await this.vocabularyListLoader().findAllByUser(user)
      const vocabularyLists = await this.vocabularyListVocabularyRelation().mergeVocabulary(vocabularyListEntities)

      return vocabularyLists
    }
}

applyMixins(
  VocabularyListApplication,
  [
    DbClientComponent,
    UserHelperComponent,
    VocabularyListVocabularyRelationComponent,
    VocabularyListRepository,
    VocabularyRepository,
  ]
)
