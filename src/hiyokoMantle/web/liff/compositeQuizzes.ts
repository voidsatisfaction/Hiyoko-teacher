import { TLambdaHttpEvent, responseHTML, response } from "../types"
import { TemplateEngine } from "../util/templateEngine";
import { PathMethodResolver } from "../../../util/LambdaUtil/pathResolver";
import { HiyokoCoreClient } from "../../hiyokoCore";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/quizzes/composite',
    'GET',
    getCompositeQuizzesHTML
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/api/quizzes/composite',
    'GET',
    getCompositeQuizzesJSON
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/api/quizzes/composite',
    'POST',
    postCompositeQuizzesResultJSON
  )

  const func = pathMethodResolver.getFunction(event.path, event.httpMethod)
  await func()

  async function getCompositeQuizzesHTML() {
    const filePath = `${__dirname}/template/compositeQuizzes.ejs`
    try {
      const html: string = await TemplateEngine.renderHTML(filePath, {})
      callback(null, responseHTML(200, html))
    } catch (error) {
      console.error(error)
      callback(null, responseHTML(500, 'Some error occured'))
    }
  }

  async function getCompositeQuizzesJSON() {
    try {
      const userId = event.queryStringParameters.userId

      const compositeQuizzes = await HiyokoCoreClient.getCompositeQuizzes(userId)
      callback(null, response(200, { result: 'success', compositeQuizzes }))
    } catch (error) {
      console.error(error)
      callback(null, response(500, { result: 'fail' }))
    }
  }

  async function postCompositeQuizzesResultJSON() {
    try {
      const body = JSON.parse(event.body)
      const { userId, total, correct, incorrect, detail } = body

      const res = await HiyokoCoreClient.postCompositeQuizzesResult(
        userId, total, correct, incorrect, detail
      )

      callback(null, response(200, { result: res.result }))
    } catch (error) {
      console.error(error)
      callback(null, response(500, { result: 'fail' }))
    }
  }
}