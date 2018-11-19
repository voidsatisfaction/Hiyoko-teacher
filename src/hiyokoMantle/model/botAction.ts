// bot message type
// text
// follow
// unfollow
// image
// video
// audio
// file
// location
// sticker

export enum BotActionTypeEnum {
  follow  = "follow",
  add     = "add",
  help    = "help"
}

// use with generics
export class BotAction {
  readonly actionType
  readonly parameters

  constructor(actionType: BotActionTypeEnum, parameters?: string[]) {
    this.actionType = actionType
    this.parameters = parameters || []
  }

  actionParameterToStinrg(): string {
    return this.parameters.join('')
  }
}

export class BotActionResult {

}