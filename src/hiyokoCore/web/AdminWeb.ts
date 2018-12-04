import * as express from 'express'
import { validationResult, check } from 'express-validator/check'

import { UserApplication } from '../application/UserApplication';
import { UserEntity } from '../domain/model/User'
import { checkAdminTokenMiddleware } from './middleware/AdminMiddleware';

const AdminRouter = express.Router()

AdminRouter.use(checkAdminTokenMiddleware)

AdminRouter.get('/', async (req: express.Request, res: express.Response) => {
  try {
    res.json('ok')
  } catch(e) {
    res.status(500).json({ error: e.toString() })
  }
})

// AdminRouter.get('/users', async (req: express.Request, res: ))

export default AdminRouter