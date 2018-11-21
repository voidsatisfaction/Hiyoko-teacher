import axios, { AxiosInstance } from 'axios'
import { Configure } from '../../../config'

interface IUser {
  userId: string
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
}