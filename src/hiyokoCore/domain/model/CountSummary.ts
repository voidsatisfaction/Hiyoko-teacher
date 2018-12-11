export enum CountCategory {
  addingVocabularyList = 'adding_vocabulary_list',
  takingQuiz           = 'taking_quiz',
}

export class CountSummaryEntity {
  readonly userId: string
  readonly countCategory: CountCategory
  readonly date: Date
  readonly count: number

  constructor(
    userId: string,
    countCategory: CountCategory,
    date: Date,
    count: number
  ) {
    this.userId = userId
    this.countCategory = countCategory
    this.date = date || new Date()
    this.count = count || 0
  }
}