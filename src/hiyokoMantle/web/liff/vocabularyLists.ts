import { TLambdaHttpEvent, responseHTML, response } from "../types"
import { TemplateEngine } from "../util/templateEngine"
import { PathMethodResolver } from "../../../util/LambdaUtil/pathResolver"
import { HiyokoCoreService } from "../../service/HiyokoCore"
import { HiyokoCoreClient } from "../../hiyokoCore";
import { IVocabularyList } from "../../model/VocabularyList";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/vocabularyLists/all',
    'GET',
    getVocabularyListsHTML
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/api/vocabularyLists',
    'GET',
    getVocabularyListsAllJSON
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/api/vocabularyLists',
    'PUT',
    putVocabularyListJSON
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/api/vocabularyLists',
    'DELETE',
    deleteVocabularyListJSON
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

  async function putVocabularyListJSON() {
    try {
      const body = JSON.parse(event.body)

      const userId: string = body.userId
      const vocaListId: number = body.vocaListId
      const meaning: string = body.meaning
      const contextSentence: string | null = body.contextSentence || null

      const editedVocabularyList: IVocabularyList = await HiyokoCoreClient.putVocabularyList(
        userId, vocaListId, meaning, contextSentence
      )

      callback(null, response(200, editedVocabularyList))
    } catch(error) {
      console.error(error)
      callback(null, response(500, JSON.stringify(error)))
    }
  }

  async function deleteVocabularyListJSON() {
    try {
      const body = JSON.parse(event.body)
      const userId: string = body.userId
      const vocaListId: number = body.vocaListId

      await HiyokoCoreClient.deleteVocabularyList(userId, vocaListId)

      callback(null, response(200, {}))
    } catch(error) {
      console.error(error)
      callback(null, response(500, 'Some error occured'))
    }
  }
}