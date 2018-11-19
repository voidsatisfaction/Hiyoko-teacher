import * as line from '@line/bot-sdk'
import { BotActionControllerResolver } from '../../botController/Resolver';

export class Context {
  readonly botClient: line.Client
  readonly botActionControllerResolver: BotActionControllerResolver

  constructor(
    botClient: line.Client,
    botActionControllerResolver: BotActionControllerResolver
  ) {
    this.botClient = botClient
    this.botActionControllerResolver = botActionControllerResolver
  }
}