import * as express from 'express'
import { validationResult, check } from 'express-validator/check'

import { PlanningApplication, CountPlan } from '../application/PlanningApplication'
import { DateTime } from '../../util/DateTime';
import { CountCategory } from '../domain/model/CountSummary';

interface ICountPlan extends ICountSummary {}

interface ICountSummary {
  countCategory: CountCategory
  date: string
  count: number
}

const UserSettingRouter = express.Router()

UserSettingRouter.get('/planning/:userId', [
  check('userId').isString()
], async (req: express.Request, res: express.Response) => {
  try {
    const bodyErrors = validationResult(req)
    if (!bodyErrors.isEmpty()) {
      return res.status(400).json({ errors: bodyErrors.array() })
    }

    const userId: string = req.params.userId

    const planningApplication = new PlanningApplication(userId)
    const planAchievement = await planningApplication.getThisWeekPlanAchievement()

    res.json({ planAchievement: planAchievement.toJSON() })
  } catch (e) {
    res.status(500).json({ error: e.toString() })
  }
})

UserSettingRouter.post('/planning/count', [
  check('userId').isString(),
  check('countPlans').isArray()
], async (req: express.Request, res: express.Response) => {
  try {
    const bodyErrors = validationResult(req)
    if (!bodyErrors.isEmpty()) {
      return res.status(400).json({ errors: bodyErrors.array() })
    }

    const userId: string = req.body.userId
    const countPlans: ICountPlan[] = req.body.countPlans

    const planningApplication = new PlanningApplication(userId)
    await planningApplication.setCountPlans(
      countPlans.map(
        countPlan => new CountPlan(
          userId,
          countPlan.countCategory,
          new DateTime(countPlan.date),
          countPlan.count
        )
      )
    )

    res.status(200).json({ result: 'success' })
  } catch(e) {
    res.status(500).json({ error: e.toString() })
  }
})

export default UserSettingRouter