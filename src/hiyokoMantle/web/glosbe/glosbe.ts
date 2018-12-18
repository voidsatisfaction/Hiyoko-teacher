import { TLambdaHttpEvent, response } from "../types"
import { PathMethodResolver } from "../../../util/LambdaUtil/pathResolver";
import { GlosbeClient } from "../../glosbeApi";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/glosbe/translate',
    'GET',
    getGlosbeTranslateJSON
  )

  const func = pathMethodResolver.getFunction(event.path, event.httpMethod)
  await func()

  async function getGlosbeTranslateJSON() {
    try {
      const vocabulary = event.queryStringParameters.vocabulary

      const glosbeClient = new GlosbeClient()

      const result: string[] = await glosbeClient.getTranslationOf(vocabulary)

      callback(null, response(200, result))
    } catch (error) {
      console.error(error)
      callback(null, response(500, 'Some error occured'))
    }
  }
}

