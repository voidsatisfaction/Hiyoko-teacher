import * as express from 'express'

const UserRouter = express.Router()

UserRouter.get('/', (req, res) => {
  res.json('success')
})

export default UserRouter