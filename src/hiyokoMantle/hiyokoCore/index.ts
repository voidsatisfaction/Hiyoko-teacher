import axios, { AxiosInstance } from 'axios'
import { Configure } from '../../../config'
import { IVocabularyList } from '../model/VocabularyList'
import { IUser } from '../model/User'
import { ISimpleQuiz, IQuiz } from '../model/SimpleQuiz';

export class HiyokoCoreClient {
  private static _client(): AxiosInstance {
    const config: Configure = new Configure()

    return axios.create({
      baseURL: config.coreURL,
    })
  }

  static async follow(userId: string, productId: number): Promise<IUser> {
    try {
      const result = await this._client().post('/users', {
        userId,
        productId
      })

      return result.data
    } catch(error) {
      throw error
    }
  }

  static async addVocabularyList(
    userId: string,
    name: string,
    meaning: string,
    contextSentence?: string
  ): Promise<IVocabularyList> {
    try {
      const response = await this._client().post('/vocabularyLists', {
        userId, name, meaning, contextSentence
      })

      return response.data
    } catch(error) {
      throw error
    }
  }

  static async getUserVocabularyLists(
    userId: string
  ): Promise<IVocabularyList[]> {
    try {
      const response = await this._client().get(`/vocabularyLists/${userId}/all`)

      return response.data
    } catch(error) {
      throw error
    }
  }

  static async deleteVocabularyList(
    userId: string,
    vocaListId: number
  ): Promise<void> {
    try {
      await this._client().delete('/vocabularyLists', {
        data: {
          userId, vocaListId
        }
      })

      return
    } catch(error) {
      throw error
    }
  }

  static async getSimpleQuizzes(
    userId: string
  ): Promise<ISimpleQuiz[]> {
    try {
      const response = await this._client().get('/quizzes/simple', {
        params: {
          userId
        }
      })

      return response.data.quizzes
    } catch(error) {
      throw error
    }
  }

  static async postSimpleQuizzesResult(
    userId: string,
    total: number,
    correct: number,
    incorrect: number,
    detail: {
      quiz: ISimpleQuiz,
      correct: boolean
    }[]
  ): Promise<{ result: 'success' | 'fail' }> {
    try {
      const response = await this._client().post('/quizzes/simple/result', {
        userId, total, correct, incorrect, detail
      })

      return response.data.result
    } catch(error) {
      throw error
    }
  }

  static async getCompositeQuizzes (
    userId: string
  ): Promise<IQuiz[]> {
    try {
      const response = await this._client().get('/quizzes/composite', {
        params: {
          userId
        }
      })

      return response.data.quizzes
    } catch(error) {
      throw error
    }
  }

  static async postCompositeQuizzesResult(
    userId: string,
    total: number,
    correct: number,
    incorrect: number,
    detail: {
      quiz: IQuiz,
      correct: boolean
    }[]
  ): Promise<{ result: 'success' | 'fail' }> {
    try {
      const response = await this._client().post('/quizzes/composite/result', {
        userId, total, correct, incorrect, detail
      })

      return response.data.result
    } catch (error) {
      throw error
    }
  }
}