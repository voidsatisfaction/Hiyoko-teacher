import { BotActionControllerBase } from './Base'
import { BotAction } from '../model/botAction'
import { BotActionResult, BotActionResultCreator } from '../model/botActionResult'

export class FollowBotActionController extends BotActionControllerBase {
  async execute(botAction: BotAction): Promise<BotActionResult> {
    // TODO: add hiyoko core user logic
    return BotActionResultCreator.textMessage(`
      Welcome to Hiyoko Sensei App!
    `)
  }
}