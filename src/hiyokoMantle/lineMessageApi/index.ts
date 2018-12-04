import * as line from '@line/bot-sdk'
import { Configure } from "../../../config";

interface ILineMessageApiClient {
  pushMessage(to: string, messages: line.Message | line.Message[]): Promise<any>
  multicast(to: string[], messages: line.Message | line.Message[]): Promise<any>
}

type TextMessage = {
  type: 'text'
  text: string
}

export class LineMessageApiClient {
  static _client(): ILineMessageApiClient {
    const config = new Configure()
    const lineMessageApiConfig = {
      channelAccessToken: config.lineBotAccessToken,
      channelSecret: config.lineBotSecretToken
    }

    return new line.Client(lineMessageApiConfig)
  }

  static async pushTextMessageToUser(userId: string, textMessage: TextMessage): Promise<void> {
    await this._client().pushMessage(userId, textMessage)
  }

  // FIXME: it can only send messages upto 150 people
  static async pushTextMessageToUsers(userIds: string[], textMessage: string): Promise<void> {
    const textMessageObject: TextMessage = { type: 'text', text: textMessage }
    await this._client().multicast(userIds, textMessageObject)
  }
}