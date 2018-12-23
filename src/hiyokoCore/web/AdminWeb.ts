import * as express from 'express'

import { UserApplication } from '../application/UserApplication'
import { checkAdminTokenMiddleware } from './middleware/AdminMiddleware'
import { PlanningApplication } from '../application/PlanningApplication';
import { CountCategory } from '../domain/model/CountSummary';
import { DateString } from '../../util/DateTime';

const AdminRouter = express.Router()

const SYSTEM_USER_ID = 'SYSTEM_USER_HELLO^^'

AdminRouter.use(checkAdminTokenMiddleware)

AdminRouter.get('/', async (req: express.Request, res: express.Response) => {
  try {
    res.json('ok')
  } catch(e) {
    res.status(500).json({ error: e.toString() })
  }
})

AdminRouter.get('/users/all', async (req: express.Request, res: express.Response) => {
  try {
    const userApplication = new UserApplication(SYSTEM_USER_ID)

    const allUsers = await userApplication.adminListAll()

    res.json({ users: allUsers })
  } catch(e) {
    res.status(500).json({ error: e.toString() })
  }
})

AdminRouter.get('/users/countSummaries', async (req: express.Request, res: express.Response) => {
  try {
    const userIds: string[] = req.query.userId
    const countCategory: CountCategory = req.query.countCategory
    const date: DateString = req.query.date

    const planningApplication = new PlanningApplication(SYSTEM_USER_ID)

    const countPlans = await planningApplication.adminGetCountPlansByUserIdsAndCountCategoryAndDate(
      userIds, countCategory, date
    )

    res.json(countPlans)
  } catch(e) {
    res.status(500).json({ error: e.toString() })
  }
})

export default AdminRouter