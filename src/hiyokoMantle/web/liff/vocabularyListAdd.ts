import { TLambdaHttpEvent, responseHTML, response } from "../types"
import { TemplateEngine } from "../util/templateEngine";
import { PathMethodResolver } from "../../../util/LambdaUtil/pathResolver";
import { HiyokoCoreClient } from "../../hiyokoCore";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/vocabularyList/add',
    'GET',
    getVocabularyListAdd
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/vocabularyList/add',
    'POST',
    postVocabularyListAdd
  )

  const func = pathMethodResolver.getFunction(event.path, event.httpMethod)
  await func()

  async function getVocabularyListAdd() {
    const filePath = `${__dirname}/template/vocabularyListAdd.ejs`
    try {
      const html: string = await TemplateEngine.renderHTML(filePath, {})
      callback(null, responseHTML(200, html))
    } catch (error) {
      console.error(error)
      callback(null, responseHTML(500, 'Some error occured'))
    }
  }

  async function postVocabularyListAdd() {
    try {
      const body = JSON.parse(event.body)
      const userId: string = body.userId!
      const name: string = body.name!
      const meaning: string = body.meaning!
      const contextSentence: string | null = body.contextSentence || null
      const vocabularyList = await HiyokoCoreClient.addVocabularyList(
        userId, name, meaning, contextSentence
      )
      callback(null, response(200, { result: 'success', vocabularyList }))
    } catch(error) {
      console.error(error)
      callback(null, response(500, { result: 'fail' }))
    }
  }
}

