export enum CountCategory {
  addingVocabularyList = 'addingVocabularyList',
  takingQuiz = 'takingQuiz',

  planAddingVocabularyList = 'planAddingVocabularyList',
  planTakingQuiz = 'planTakingQuiz'
}

export interface ICountSummary {
  countCategory: CountCategory
  date: string
  count: number
}