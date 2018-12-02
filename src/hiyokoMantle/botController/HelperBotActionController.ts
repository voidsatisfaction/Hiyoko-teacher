import { BotActionControllerBase } from './Base'
import { BotAction } from '../model/botAction'
import { BotActionResult, BotActionResultCreator } from '../model/botActionResult'
import { Context } from '../web/bot/context'

export class HelperBotActionController extends BotActionControllerBase {
  async execute(context: Context, botAction: BotAction): Promise<BotActionResult> {
    return BotActionResultCreator.textMessage(`
      This is not a valid input.

      You can use either menu located below or links as follows

      -------
      Adding vocabulary: line://app/1615960675-Gye0WZOX
      Seeing vocabulary Lists: line://app/1615960675-d85ko9yN
      -------
    `)
  }
}