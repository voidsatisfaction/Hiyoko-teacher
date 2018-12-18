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
          User Settings: line://app/1627693639-O90J3QL3
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
      case 'STAGING':
        return BotActionResultCreator.textMessage(`
          This is not a valid input.

          You can use either menu located below or links as follows

          -------
          Adding vocabulary: line://app/1631792049-aZ7ERqn5
          Seeing vocabulary Lists: line://app/1631792049-9rNkrJvw
          Taking Quizzes: line://app/1631792049-qd5VpywK
          User Settings: line://app/1631792049-dbVv7Qpq
          -------
        `)
      default:
        break;
    }
  }
}