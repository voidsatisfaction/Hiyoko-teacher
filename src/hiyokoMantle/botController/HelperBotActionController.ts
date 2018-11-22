import { BotActionControllerBase } from './Base'
import { BotAction } from '../model/botAction'
import { BotActionResult, BotActionResultCreator } from '../model/botActionResult'
import { Context } from '../web/bot/context'

export class HelperBotActionController extends BotActionControllerBase {
  async execute(context: Context, botAction: BotAction): Promise<BotActionResult> {
    return BotActionResultCreator.textMessage(`
      This is not a valid input.

      You can use either menu located below or commands as follow

      -------
      add {word} {meaning}


      -------
    `)
  }
}