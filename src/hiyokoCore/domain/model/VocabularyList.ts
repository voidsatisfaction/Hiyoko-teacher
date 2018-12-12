import { DateTime } from "../../../util/DateTime";

export class VocabularyListEntity {
  readonly vocaListId: number
  readonly userId: string
  readonly vocaId: number
  readonly meaning: string
  readonly priority: number
  readonly contextSentence: string
  readonly contextPictureURL: string
  readonly createdAt: DateTime

  constructor(
    vocaListId: number,
    userId: string,
    vocaId: number,
    meaning: string,
    priority: number,
    createdAt?: DateTime,
    contextSentece?: string,
    contextPictureURL?: string,
  ) {
    this.vocaListId = vocaListId
    this.userId = userId
    this.vocaId = vocaId
    this.meaning = meaning
    this.priority = priority
    this.createdAt = createdAt || new DateTime()
    this.contextSentence = contextSentece
    this.contextPictureURL = contextPictureURL
  }

  toJSON() {
    return ({
      vocaListId: this.vocaListId,
      userId: this.userId,
      vocaId: this.vocaId,
      meaning: this.meaning,
      priority: this.priority,
      createdAt: this.createdAt.toDateTimeString(),
      contextSentence: this.contextSentence,
      contextPictureURL: this.contextPictureURL,
    })
  }
}