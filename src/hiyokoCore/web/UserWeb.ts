import * as express from 'express'
import { validationResult, check } from 'express-validator/check'

import { UserApplication } from '../application/UserApplication';
import { UserEntity } from '../domain/model/User';

const UserRouter = express.Router()

UserRouter.post('/', [
  check('userId').isString(),
  check('productId').isNumeric(),
], async (req: express.Request, res: express.Response) => {
  try {
    const bodyErrors = validationResult(req)
    if (!bodyErrors.isEmpty()) {
      return res.status(400).json({ errors: bodyErrors.array() })
    }

    const userId: string = req.body.userId
    const productId: number = req.body.productId
    const userApplication: UserApplication = new UserApplication(userId)

    const user: UserEntity = await userApplication.getOrAdd(productId)

    res.json({ user })
  } catch(e) {
    res.status(500).json({ error: e.toString() })
  }
})

export default UserRouter