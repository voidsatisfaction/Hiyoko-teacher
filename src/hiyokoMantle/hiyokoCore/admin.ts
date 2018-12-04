import axios, { AxiosInstance } from 'axios'
import { Configure } from '../../../config'
import { IUser } from '../model/User';

export class AdminHiyokoCoreClient {
  private static _client(): AxiosInstance {
    const config: Configure = new Configure()

    return axios.create({
      baseURL: config.coreURL,
      headers: {
        'admin-token': config.adminToken
      }
    })
  }

  static async listAllUsers(): Promise<IUser[]> {
    try {
      const response = await this._client().get('/admin/users/all')

      return response.data.users
    } catch(error) {
      throw error
    }
  }
}