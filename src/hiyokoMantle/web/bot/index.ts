import * as line from '@line/bot-sdk'

import { TLambdaHttpEvent, response } from "../types";
import { Configure } from "../../../../config";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const config = new Configure()
  const botClient = new line.Client({
    channelAccessToken: config.lineBotAccessToken,
    channelSecret: config.lineBotSecretToken,
  })

  const handleBotMessageEvent = async (e: line.MessageEvent) => {
    // TODO: actionParser: parse action
    // TODO: actionExecutor: execute action
    const userId = e.source.userId
    const profile = await botClient.getProfile(userId)

    console.log(profile)

    console.log('rich menu id')
    // const currentUserRichMenu = await botClient.getRichMenuIdOfUser(userId)
    // console.log(currentUserRichMenu)
    
    console.log('rich menu list')
    const richMenuList = await botClient.getRichMenuList()
    console.log(richMenuList)

    // TODO: return result to user
    return await botClient.replyMessage(e.replyToken, {
      type: 'text',
      text: `honololo wow! ${process.env.NODE_ENV}`
    })
  }

  try {
    // more clear log of stringified object
    console.log('event.body')
    console.log(event.body)

    const botBody = JSON.parse(event.body)

    const results = await Promise.all(
      botBody.events.map(handleBotMessageEvent)
    )
    
    callback(null, response(200, results))
  } catch(error) {
    console.error(error)
    callback(null, response(500, 'Some error occured'))
  }
}

// class HandlerManager {
//   private event: TLambdaHttpEvent
//   private callback: any
//   private pathMethodHandler: any

//   constructor(event: TLambdaHttpEvent, callback: any) {
//     this.event = event
//     this.callback = callback
//     this.pathMethodHandler = {}
//   }

//   private isRegisteredPathMethod(path: string, method: string): boolean {

//   }

//   register(path: string, method: string, handler: () => any) {
//     this.pathMethodHandler[path]
//   }
// }