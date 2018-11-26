import { applyMixins } from "../../util/Mixin"
import { DbClientComponent } from "../infrastructure/db/client"
import { UserHelperComponent } from "./helper/UserHelper"
import { UserEntity } from "../domain/model/User"
import { IUserBootstrap, IUserLoader } from "../domain/repository/UserRepository"
import { IDbClient } from "../interface/infrastructure/db"
import { VocabularyListRepository } from "../infrastructure/db/VocabularyListRepository"
import { VocabularyRepository } from "../infrastructure/db/VocabularyRepository"
import { IVocabularyListAction } from "../domain/repository/VocabularyListRepository"
import { IVocabularyBootstrap } from "../domain/repository/VocabularyRepository"

export class VocabularyList {
  readonly userId: string
  readonly name: string
  readonly meaning: string
  readonly contextSentence: string

  constructor(
    userId: string, name: string, meaning: string, contextSentence: string
  ) {
    this.userId = userId
    this.name = name
    this.meaning = meaning
    this.contextSentence = contextSentence
  }
}

export class VocabularyListApplication
  implements DbClientComponent, UserHelperComponent, VocabularyListRepository, VocabularyRepository {
    readonly dbc: IDbClient
    userId: string

    dbClient: () => IDbClient

    getCurrentUser: () => Promise<UserEntity>
    userBootstrap: () => IUserBootstrap
    userLoader: () => null

    vocabularyListLoader: () => null
    vocabularyListAction: () => IVocabularyListAction

    vocabularyBootstrap: () => IVocabularyBootstrap
    vocabularyLoader: () => null

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
        vocabulary.name,
        vocabularyList.meaning,
        vocabularyList.contextSentence
      )
    }
}

applyMixins(
  VocabularyListApplication,
  [DbClientComponent, UserHelperComponent, VocabularyListRepository, VocabularyRepository]
)
