import { BotAction } from '../model/botAction';
import { BotActionResult } from '../model/botActionResult';
import { Context } from '../web/bot/context';

export abstract class BotActionControllerBase {
  async do(context: Context, botAction: BotAction): Promise<BotActionResult> {
    // for various common processing
    return await this.execute(context, botAction)
  }

  protected abstract execute(context: Context, botAction: BotAction): Promise<BotActionResult>
}