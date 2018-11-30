import { DateTime } from "../../../util/DateTime"

export class VocabularyListEntity {
  readonly userId: string
  readonly vocaId: number
  readonly meaning: string
  readonly contextSentence: string
  readonly contextPictureURL: string
  readonly createdAt: DateTime

  constructor(
    userId: string,
    vocaId: number,
    meaning: string,
    createdAt?: DateTime,
    contextSentece?: string,
    contextPictureURL?: string,
  ) {
    this.userId = userId
    this.vocaId = vocaId
    this.meaning = meaning
    this.createdAt = createdAt || new DateTime()
    this.contextSentence = contextSentece || ''
    this.contextPictureURL = contextPictureURL || ''
  }
}