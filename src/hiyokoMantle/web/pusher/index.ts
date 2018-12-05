import { TLambdaHttpEvent, response } from "../types"
import { PathMethodResolver } from "../../../util/LambdaUtil/pathResolver"
import { LineMessageApiClient } from "../../lineMessageApi"
import { AdminHiyokoCoreClient } from "../../hiyokoCore/admin";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/pusher/message/users',
    'POST',
    postPushMessageToUsers
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/pusher/message/users/all',
    'POST',
    postPushMessageToAllUsers
  )

  const func = pathMethodResolver.getFunction(event.path, event.httpMethod)
  await func()

  async function postPushMessageToUsers() {
    try {
      const body = JSON.parse(event.body)
      const userIds: string[] = body.userIds
      const message: string = body.message

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

  async function postPushMessageToAllUsers() {
    try {
      const body = JSON.parse(event.body)
      const message: string = body.message

      const allUsers = await AdminHiyokoCoreClient.listAllUsers()
      const allUserIds = allUsers.map(user => user.userId)

      await LineMessageApiClient.pushTextMessageToUsers(allUserIds, message)

      callback(null, response(200, ({ result: 'success' })))
    } catch(error) {
      console.error(error)
      callback(null, response(500, error.toString()))
    }
  }
}

