import axios, { AxiosInstance } from 'axios'
import { Configure } from '../../../config'
import { IUser, IAdminUser } from '../model/User';
import { ICountSummary, CountCategory } from '../model/CountSummary';
import { DateString } from '../../util/DateTime';

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

  static async listAllUsers(): Promise<IAdminUser[]> {
    try {
      const response = await this._client().get('/admin/users/all')

      return response.data.users
    } catch(error) {
      throw error
    }
  }

  static async getCountSummaries(
    userIds: string[],
    countCategory: CountCategory,
    date: DateString
  ): Promise<{ userId: string, countSummary: ICountSummary }[]> {
    try {
      const response = await this._client().get('/admin/users/countSummaries', {
        params: {
          userId: userIds,
          countCategory,
          date
        },
      })

      return response.data
    } catch(error) {
      throw error
    }
  }
}