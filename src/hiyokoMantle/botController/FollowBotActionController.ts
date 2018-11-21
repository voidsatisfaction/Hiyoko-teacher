import { BotActionControllerBase } from './Base'
import { BotAction } from '../model/botAction'
import { BotActionResult, BotActionResultCreator } from '../model/botActionResult'
import { HiyokoCoreClient } from '../hiyokoCore'
import { Context } from '../web/bot/context'

export class FollowBotActionController extends BotActionControllerBase {
  async execute(context: Context, botAction: BotAction): Promise<BotActionResult> {
    try {
      await HiyokoCoreClient.follow(context.lineEvent.source.userId)
      return BotActionResultCreator.textMessage(`
      Welcome to Hiyoko Sensei App!
    `)
    } catch(error) {
      throw error
    }
  }
}