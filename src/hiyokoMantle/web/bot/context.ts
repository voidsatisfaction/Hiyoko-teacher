import * as line from '@line/bot-sdk'

export class Context {
  readonly botClient: line.Client

  constructor(
    botClient: line.Client,
  ) {
    this.botClient = botClient
  }
}