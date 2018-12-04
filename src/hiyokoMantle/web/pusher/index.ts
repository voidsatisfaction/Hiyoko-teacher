import { TLambdaHttpEvent, response } from "../types"
import { PathMethodResolver } from "..//util/pathResolver"
import { LineMessageApiClient } from "../../lineMessageApi"

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/pusher/message/users',
    'POST',
    postPushMessageToUsers
  )

  const func = pathMethodResolver.getFunction(event.path, event.httpMethod)
  await func()

  async function postPushMessageToUsers() {
    try {
      const body = JSON.parse(event.body)
      const userIds = body.userIds
      const message = body.message

      if (!userIds || !userIds.length || userIds.length === 0 || !message) {
        throw new Error(`invalid body: check body`)
      }

      await LineMessageApiClient.pushTextMessageToUsers(userIds, message)

      callback(null, response(200, ({ result: 'success' })))
    } catch (error) {
      console.error(error)
      callback(null, response(500, error.toString()))
    }
  }
}

