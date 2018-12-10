import { BotActionControllerBase } from './Base'
import { BotAction } from '../model/botAction'
import { BotActionResult, BotActionResultCreator } from '../model/botActionResult'
import { Context } from '../web/bot/context'
import { Configure } from '../../../config';

export class HelperBotActionController extends BotActionControllerBase {
  async execute(context: Context, botAction: BotAction): Promise<BotActionResult> {
    const config = new Configure()
    switch (config.nodeEnv) {
      case 'PROD':
        return BotActionResultCreator.textMessage(`
          This is not a valid input.

          You can use either menu located below or links as follows

          -------
          Adding vocabulary: line://app/1627693639-bGX5kagk
          Seeing vocabulary Lists: line://app/1627693639-YjQOy8ey
          Taking Quizzes: line://app/1627693639-YbVm2Pz2
          -------
        `)
      case 'DEV':
        return BotActionResultCreator.textMessage(`
          This is not a valid input.

          You can use either menu located below or links as follows

          -------
          Adding vocabulary: line://app/1615960675-Gye0WZOX
          Seeing vocabulary Lists: line://app/1615960675-d85ko9yN
          Taking Quizzes: line://app/1615960675-6DPkpxjX
          -------
        `)
      default:
        break;
    }
  }
}