import { BotAction } from '../model/botAction';
import { BotActionResult } from '../model/botActionResult';

export abstract class BotActionControllerBase {
  async do(botAction: BotAction): Promise<BotActionResult> {
    // for various common processing
    return await this.execute(botAction)
  }

  protected abstract execute(botAction: BotAction): Promise<BotActionResult>
}