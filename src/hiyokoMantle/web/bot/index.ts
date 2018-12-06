import * as line from '@line/bot-sdk'

import { TLambdaHttpEvent, response } from "../types"
import { Configure } from "../../../../config"
import { Context } from './context'
import { BotAction, BotActionTypeEnum } from '../../model/botAction'
import { enumIncludes } from '../../../util/Enum';

import { BotActionControllerResolver } from '../../botController/Resolver';
import { BotActionControllerBase } from '../../botController/Base';
import { BotActionResult } from '../../model/botActionResult';
import { HelperBotActionController } from '../../botController/HelperBotActionController';
import { FollowBotActionController } from '../../botController/FollowBotActionController';

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  // initialize context data
  const config = new Configure()
  const botClient = new line.Client({
    channelAccessToken: config.lineBotAccessToken,
    channelSecret: config.lineBotSecretToken,
  })

  // initialize botActionControllerResolver
  const botActionControllerResolver: BotActionControllerResolver = new BotActionControllerResolver()

  botActionControllerResolver.setController(BotActionTypeEnum.help, new HelperBotActionController())
  botActionControllerResolver.setController(BotActionTypeEnum.follow, new FollowBotActionController())

  try {
    // more clear log of stringified object
    console.log('event.body')
    console.log(event.body)
    const context: Context = new Context(
      botClient,
      botActionControllerResolver
    )
    context.inject('productId', config.productId)

    const botBody = JSON.parse(event.body)

    const results = await Promise.all(
      botBody.events.map(
        handleBotMessageEvent(context)
      )
    )

    callback(null, response(200, results))
  } catch(error) {
    console.error(error)
    callback(null, response(500, 'Some error occured'))
  }
}

export type lineAvailableEvents =
  line.MessageEvent | line.FollowEvent

function handleBotMessageEvent(
  context: Context,
) {
  return async (e: lineAvailableEvents) => {
    context.inject('lineEvent', e)
    try {
      const botActionControllerResolver = context.botActionControllerResolver
      // Action parse & validate TODO: isolate this logics
      let botAction: BotAction | undefined
      switch (e.type) {
        case 'message':
          switch (e.message.type) {
            case 'text':
              const message: string = e.message.text
              const messageArray: string[] = message.split(' ').map(str => str.toLowerCase())

              let command: string = messageArray[0]
              const parameters: string[] = messageArray.slice(1)
              if (!enumIncludes(BotActionTypeEnum, command)) {
                botAction = new BotAction(BotActionTypeEnum.help)
              } else {
                botAction = new BotAction(
                  <BotActionTypeEnum>command,
                  parameters
                )
              }
              break
            default:
              botAction = new BotAction(BotActionTypeEnum.help)
              break
          }
          break
        case 'follow':
          botAction = new BotAction(BotActionTypeEnum.follow)
          break
        default:
          botAction = new BotAction(BotActionTypeEnum.help)
      }

      // TODO: async action logging

      // Execute action
      // FIXME: use interface for loosely coupled system
      const botActionController: BotActionControllerBase = botActionControllerResolver.getController(botAction.actionType)
      const actionResult: BotActionResult = await botActionController.do(context, botAction)

      // Return Action Results to user
      const replyContent = <line.TextMessage>actionResult.getLineMessageParams()
      return await context.botClient.replyMessage(e.replyToken, replyContent)
    } catch(error) {
      throw error
    }
  }
}