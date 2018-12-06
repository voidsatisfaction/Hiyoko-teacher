import axios, { AxiosInstance } from 'axios'
import { Configure } from '../../../config'
import { IVocabularyList } from '../model/VocabularyList'
import { IUser } from '../model/User'

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
}