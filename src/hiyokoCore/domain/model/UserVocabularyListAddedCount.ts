export class UserVocabularyListAddedCountEntity {
  readonly userId: string
  readonly date: Date
  readonly count: number

  constructor(
    userId: string,
    date: Date,
    count: number
  ) {
    this.userId = userId
    this.date = date || new Date()
    this.count = count || 0
  }
}