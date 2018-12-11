import { TLambdaHttpEvent, responseHTML, response } from "../types"
import { TemplateEngine } from "../util/templateEngine"
import { PathMethodResolver } from "../../../util/LambdaUtil/pathResolver"

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/userSetting/home',
    'GET',
    getUserSettingHome
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/userSetting/planning',
    'GET',
    getUserSettingPlanning
  )

  const func = pathMethodResolver.getFunction(event.path, event.httpMethod)
  await func()

  async function getUserSettingHome() {
    const filePath = `${__dirname}/template/userSetting/home.ejs`
    try {
      const html: string = await TemplateEngine.renderHTML(filePath, {})
      callback(null, responseHTML(200, html))
    } catch (error) {
      console.error(error)
      callback(null, responseHTML(500, 'Some error occured'))
    }
  }

  async function getUserSettingPlanning() {
    const filePath = `${__dirname}/template/userSetting/planning.ejs`
    try {
      const html: string = await TemplateEngine.renderHTML(filePath, {})
      callback(null, responseHTML(200, html))
    } catch (error) {
      console.error(error)
      callback(null, responseHTML(500, 'Some error occured'))
    }
  }
}

