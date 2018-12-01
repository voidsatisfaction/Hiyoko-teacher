import axios, { AxiosInstance } from 'axios'
import { Configure } from '../../../config'

interface IUser {
  userId: string
  createdAt: string
}

interface IVocabularyList {
  userId: string
  name: string
  meaning: string
  contextSentence: string
  createdAt: string
}

export class HiyokoCoreClient {
  private static _client(): AxiosInstance {
    const config: Configure = new Configure()

    return axios.create({
      baseURL: config.coreURL,
    })
  }

  static async follow(userId: string): Promise<IUser> {
    try {
      const result = await this._client().post('/users', {
        userId
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
}