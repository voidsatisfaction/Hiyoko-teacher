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

  pathMethodResolver.setFunction(
    '/hiyokoSensei/api/userSetting/planning/count',
    'PUT',
    putUserSettingCountPlanningJSON
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
          CountCategory.planAddingVocabularyList,
          CountCategory.takingQuiz
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

  async function putUserSettingCountPlanningJSON() {
    try {
      const body = JSON.parse(event.body)

      const userId = body.userId
      const countPlans = body.countPlans

      await HiyokoCoreClient.putCountPlans(userId, countPlans)

      callback(null, response(200, { result: 'success' }))
    } catch(error) {
      console.error(error)
      callback(null, response(500, 'Some error occured'))
    }
  }
}

