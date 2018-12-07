import * as express from 'express'
import { validationResult, check } from 'express-validator/check'

import { QuizApplication } from '../application/QuizApplication';

const QuizRouter = express.Router()

QuizRouter.get('/simple', [
  check('userId').isString(),
], async (req: express.Request, res: express.Response) => {
  try {
    const bodyErrors = validationResult(req)
    if (!bodyErrors.isEmpty()) {
      return res.status(400).json({ errors: bodyErrors.array() })
    }

    const userId: string = req.query.userId

    const quizApplication = new QuizApplication(userId)
    const simpleQuizzes = await quizApplication.getSimpleQuizzes()

    res.json({ quizzes: simpleQuizzes })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.toString() })
  }
})

export default QuizRouter