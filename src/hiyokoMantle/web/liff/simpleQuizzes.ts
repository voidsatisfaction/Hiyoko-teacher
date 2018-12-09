import { TLambdaHttpEvent, responseHTML, response } from "../types"
import { TemplateEngine } from "../util/templateEngine";
import { PathMethodResolver } from "../../../util/LambdaUtil/pathResolver";
import { HiyokoCoreClient } from "../../hiyokoCore";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/quizzes/simple',
    'GET',
    getSimpleQuizzesHTML
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/api/quizzes/simple',
    'GET',
    getSimpleQuizzesJSON
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/api/quizzes/simple',
    'POST',
    postSimpleQuizzesResultJSON
  )

  const func = pathMethodResolver.getFunction(event.path, event.httpMethod)
  await func()

  async function getSimpleQuizzesHTML() {
    const filePath = `${__dirname}/template/simpleQuizzes.ejs`
    try {
      const html: string = await TemplateEngine.renderHTML(filePath, {})
      callback(null, responseHTML(200, html))
    } catch (error) {
      console.error(error)
      callback(null, responseHTML(500, 'Some error occured'))
    }
  }

  async function getSimpleQuizzesJSON() {
    try {
      const userId = event.queryStringParameters.userId

      const simpleQuizzes = await HiyokoCoreClient.getSimpleQuizzes(userId)
      callback(null, response(200, { result: 'success', simpleQuizzes }))
    } catch (error) {
      console.error(error)
      callback(null, response(500, { result: 'fail' }))
    }
  }

  async function postSimpleQuizzesResultJSON() {
    try {
      const body = JSON.parse(event.body)
      const { userId, total, correct, incorrect, detail } = body

      const res = await HiyokoCoreClient.postSimpleQuizzesResult(
        userId, total, correct, incorrect, detail
      )

      callback(null, response(200, { result: res.result }))
    } catch (error) {
      console.error(error)
      callback(null, response(500, { result: 'fail' }))
    }
  }
}