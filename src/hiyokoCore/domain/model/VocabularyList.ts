export class VocabularyListEntity {
  readonly vocaListId: number
  readonly userId: string
  readonly vocaId: number
  readonly meaning: string
  readonly contextSentence: string
  readonly contextPictureURL: string
  readonly createdAt: Date

  constructor(
    vocaListId: number,
    userId: string,
    vocaId: number,
    meaning: string,
    createdAt?: Date,
    contextSentece?: string,
    contextPictureURL?: string,
  ) {
    this.vocaListId = vocaListId
    this.userId = userId
    this.vocaId = vocaId
    this.meaning = meaning
    this.createdAt = createdAt || new Date()
    this.contextSentence = contextSentece
    this.contextPictureURL = contextPictureURL
  }

  toLogObject() {
    return ({
      vocaListId: this.vocaListId,
      userId: this.userId,
      vocaId: this.vocaId,
      meaning: this.meaning,
      createdAt: this.createdAt.toLocaleString(),
      contextSentence: this.contextSentence,
      contextPictureURL: this.contextPictureURL
    })
  }
}