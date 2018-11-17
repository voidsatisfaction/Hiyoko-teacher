import * as line from '@line/bot-sdk'

import { TLambdaHttpEvent, response } from "../types";
import { Configure } from "../../../../config";
import { Context } from './context';

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const config = new Configure()
  const botClient = new line.Client({
    channelAccessToken: config.lineBotAccessToken,
    channelSecret: config.lineBotSecretToken,
  })

  try {
    // more clear log of stringified object
    console.log('event.body')
    console.log(event.body)
    const context: Context = new Context(botClient)

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

function parseBotAction(e: line.MessageEvent) {

}

function handleBotMessageEvent(
  context: Context
) {
  // TODO: actionParser: parse action
  // TODO: actionExecutor: execute action
  return async (e: line.MessageEvent) => {
    const userId = e.source.userId

    const profile = await context.botClient.getProfile(userId)
    console.log(profile)

    return await context.botClient.replyMessage(e.replyToken, {
      type: 'text',
      text: `honololo wow! ${process.env.NODE_ENV}`
    })
  }
}