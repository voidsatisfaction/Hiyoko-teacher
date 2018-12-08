// T is SimpleQuiz ... etc
export interface IQuizResult<T> {
  total: number
  correct: number
  incorrect: number
  detail: {
    quiz: T,
    correct: boolean
  }[]
}