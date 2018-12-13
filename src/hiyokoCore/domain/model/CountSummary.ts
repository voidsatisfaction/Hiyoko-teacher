import { DateTime } from "../../../util/DateTime";

export enum CountCategory {
  addingVocabularyList = 'addingVocabularyList',
  takingQuiz           = 'takingQuiz',

  planAddingVocabularyList = 'planAddingVocabularyList',
  planTakingQuiz           = 'planTakingQuiz'
}

export class CountSummaryEntity {
  readonly userId: string
  readonly countCategory: CountCategory
  readonly date: DateTime
  readonly count: number

  constructor(
    userId: string,
    countCategory: CountCategory,
    date: DateTime,
    count: number
  ) {
    this.userId = userId
    this.countCategory = countCategory
    this.date = date || new DateTime()
    this.count = count || 0
  }
}