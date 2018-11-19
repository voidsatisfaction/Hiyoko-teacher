import { BotActionControllerBase } from "./Base";
import { BotActionTypeEnum } from "../model/botAction";

export class BotActionControllerResolver {
  private actionTypeToController: { [key: string]: BotActionControllerBase }

  constructor() {
    this.actionTypeToController = {}
  }

  setController(botActionType: BotActionTypeEnum, botActionController: BotActionControllerBase): void {
    this.actionTypeToController[botActionType] = botActionController
  }

  getController(botActionType: BotActionTypeEnum): BotActionControllerBase {
    const maybeBotActionController = this.actionTypeToController[botActionType]
    if (!maybeBotActionController) {
      throw `This bot action has not been set, botAction: ${botActionType}`
    }

    return maybeBotActionController
  }
}