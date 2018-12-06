import * as line from '@line/bot-sdk'
import { BotActionControllerResolver } from '../../botController/Resolver';
import { lineAvailableEvents } from '.'

export class Context {
  readonly botClient: line.Client
  readonly botActionControllerResolver: BotActionControllerResolver
  readonly lineEvent: lineAvailableEvents
  readonly productId: number

  constructor(
    botClient: line.Client,
    botActionControllerResolver: BotActionControllerResolver
  ) {
    this.botClient = botClient
    this.botActionControllerResolver = botActionControllerResolver
  }

  inject(key: string, value: any): void {
    this[key] = value
  }
}