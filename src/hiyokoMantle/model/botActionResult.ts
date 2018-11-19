type ActionResultType = 'text'

export abstract class BotActionResult {
  readonly type: string

  constructor(type: ActionResultType) {
    this.type = type
  }

  abstract getLineMessageParams(): object
}

class TextBotActionResult extends BotActionResult {
  readonly text: string

  constructor(type: ActionResultType, text: string) {
    super(type)
    this.text = text
  }

  getLineMessageParams(): object {
    return ({
      type: this.type,
      text: this.text
    })
  }
}

export class BotActionResultCreator {
  static textMessage(text: string): TextBotActionResult {
    return new TextBotActionResult('text', text)
  }
}