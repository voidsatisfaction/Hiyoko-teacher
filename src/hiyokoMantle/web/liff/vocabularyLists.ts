import { TLambdaHttpEvent, responseHTML, response } from "../types"
import { TemplateEngine } from "./util/templateEngine"
import { PathMethodResolver } from "./util/pathResolver"
import { HiyokoCoreService } from "../../service/HiyokoCore"

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/vocabularyLists/all',
    'GET',
    getVocabularyListsHTML
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/api/vocabularyLists/all',
    'GET',
    getVocabularyListsAllJSON
  )

  const func = pathMethodResolver.getFunction(event.path, event.httpMethod)
  await func()

  async function getVocabularyListsHTML() {
    const filePath = `${__dirname}/template/vocabularyLists.ejs`
    try {
      const html: string = await TemplateEngine.renderHTML(filePath, {})
      callback(null, responseHTML(200, html))
    } catch (error) {
      console.error(error)
      callback(null, responseHTML(500, 'Some error occured'))
    }
  }

  async function getVocabularyListsAllJSON() {
    try {
      const userId = event.queryStringParameters.userId

      const normalizedVocabularyLists = await HiyokoCoreService.getAndProcessUserVocabularyLists(userId)

      callback(null, response(200, normalizedVocabularyLists))
    } catch(error) {
      console.error(error)
      callback(null, response(500, 'Some error occured'))
    }
  }
}