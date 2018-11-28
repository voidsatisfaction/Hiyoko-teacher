import { TLambdaHttpEvent, responseHTML } from "../types"
import { TemplateEngine } from "./util/templateEngine";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const filePath = `${__dirname}/template/vocabularyListAdd.ejs`

  try {
    const html: string = await TemplateEngine.renderHTML(filePath, {})
    callback(null, responseHTML(200, html))
  } catch (error) {
    console.error(error)
    callback(null, responseHTML(500, 'Some error occured'))
  }
}