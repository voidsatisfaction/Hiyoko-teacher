import * as AWS from 'aws-sdk'
import { Configure } from '../../../../../config'
import { TableNames, ILoggerDBClient } from '../../../interface/infrastructure/LoggerDB'

export class LoggerDBClientComponent {
  loggerDBClient(): ILoggerDBClient {
    return new LoggerDBClient()
  }
}

export class LoggerDBClient implements ILoggerDBClient {
  private readonly nodeEnv: string
  private readonly dynamodb: AWS.DynamoDB.DocumentClient
  constructor() {
    const config = new Configure()

    this.nodeEnv = config.nodeEnv

    // FIXME: Global instance to better initialization
    if (this.nodeEnv === 'PROD') {
      AWS.config.update({
        region: 'ap-northeast-1',
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey
      })
    } else {
      AWS.config.update({
        region: 'ap-northeast-1',
        endpoint: 'http://localhost:18000',
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey
      }, true)
    }

    this.dynamodb = new AWS.DynamoDB.DocumentClient()
  }

  putItem(
    tableName: TableNames,
    userId: string,
    productId: number,
    action: string,
    createdAt: string,
    content?: object,
  ): Promise<object> {
    const params = {
      TableName: tableName,
      Item: {
        userId,
        productId,
        action,
        createdAt,
        content,
      }
    }

    return new Promise((resolve, reject) => {
      this.dynamodb.put(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }
}