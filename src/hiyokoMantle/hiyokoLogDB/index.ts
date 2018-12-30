import * as AWS from 'aws-sdk'
import { Configure } from "../../../config"
import { ActionLog } from '../model/ActionLog';

export class HiyokoLogDBClient {
  static tableName: string = ''
  private static _client(): AWS.DynamoDB.DocumentClient {
    const config = new Configure()

    AWS.config.update({
      region: 'ap-northeast-1',
      accessKeyId: process.env.AWS_LAMBDA_ACCESS_KEY || config.awsAccessKeyId,
      secretAccessKey: process.env.AWS_LAMBDA_SECRET_KEY || config.awsSecretAccessKey
    })

    return new AWS.DynamoDB.DocumentClient()
  }

  static async getAllLogs(): Promise<ActionLog[]> {
    let logs: ActionLog[] = []

    const params: any = {
      TableName: 'HiyokoActionLogs',
    }

    const result = await this.scanTable(params)
    logs = logs.concat(<any>result.Items)
    params.ExclusiveStartKey = result.LastEvaluatedKey

    while (params.ExclusiveStartKey) {
      const result = await this.scanTable(params)

      logs = logs.concat(<any>result.Items)

      params.ExclusiveStartKey = result.LastEvaluatedKey
    }

    return logs
  }

  private static async scanTable(params): Promise<AWS.DynamoDB.ScanOutput> {
    return new Promise((resolve, reject) => {
      this._client().scan(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }
}