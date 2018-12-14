import { TLambdaHttpEvent, responseHTML, response } from "../types"
import { TemplateEngine } from "../util/templateEngine"
import { PathMethodResolver } from "../../../util/LambdaUtil/pathResolver"
import { HiyokoCoreClient } from '../../hiyokoCore'
import { CountCategory } from "../../model/CountSummary";

export const handler = async (event: TLambdaHttpEvent, context, callback) => {
  const pathMethodResolver = new PathMethodResolver()

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/userSetting/home',
    'GET',
    getUserSettingHomeHTML
  )

  pathMethodResolver.setFunction(
    '/hiyokoSensei/liff/userSetting/planning',
    'GET',
    getUserSettingPlanningHTML
  )

  const func = pathMethodResolver.getFunction(event.path, event.httpMethod)
  await func()

  async function getUserSettingHomeHTML() {
    const filePath = `${__dirname}/template/userSetting/home.ejs`
    try {
      const html: string = await TemplateEngine.renderHTML(filePath, {})
      callback(null, responseHTML(200, html))
    } catch (error) {
      console.error(error)
      callback(null, responseHTML(500, 'Some error occured'))
    }
  }

  async function getUserSettingPlanningHTML() {
    const filePath = `${__dirname}/template/userSetting/planning.ejs`
    try {
      const userId: string = event.queryStringParameters.userId

      const planAchievement = await HiyokoCoreClient.getThisWeekPlanAchievement(userId)

      const html: string = await TemplateEngine.renderHTML(filePath, {
        length: 2,
        classes: [
          'adding-vocabulary-count',
          'taking-quiz-count'
        ],
        titles: [
          '1. Adding vocabulary count',
          '2. Taking quiz count'
        ],
        plans: [
          planAchievement.plan[CountCategory.planAddingVocabularyList],
          planAchievement.plan[CountCategory.planTakingQuiz]
        ],
        achievements: [
          planAchievement.achievement[CountCategory.addingVocabularyList],
          planAchievement.achievement[CountCategory.takingQuiz]
        ]
      })

      callback(null, responseHTML(200, html))
    } catch (error) {
      console.error(error)
      callback(null, responseHTML(500, 'Some error occured'))
    }
  }
}

