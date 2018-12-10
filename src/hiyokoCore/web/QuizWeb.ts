import * as express from 'express'
import { validationResult, check } from 'express-validator/check'

import { QuizApplication, SimpleQuiz } from '../application/QuizApplication';
import { QuizResultApplication, QuizResult } from '../application/QuizResultApplication';

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

QuizRouter.get('/composite', [
  check('userId').isString(),
], async (req: express.Request, res: express.Response) => {
  try {
    const bodyErrors = validationResult(req)
    if (!bodyErrors.isEmpty()) {
      return res.status(400).json({ errors: bodyErrors.array() })
    }

    const userId: string = req.query.userId

    const quizApplication = new QuizApplication(userId)
    const compositeQuizzes = await quizApplication.createCompositeQuizzes()

    res.json({ quizzes: compositeQuizzes })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.toString() })
  }
})

QuizRouter.post('/simple/result', [
  check('userId').isString(),
  check('total').isNumeric(),
  check('correct').isNumeric(),
  check('incorrect').isNumeric(),
  check('detail').isArray()
], async (req: express.Request, res: express.Response) => {
  try {
    const bodyErrors = validationResult(req)
    if (!bodyErrors.isEmpty()) {
      return res.status(400).json({ errors: bodyErrors.array() })
    }

    const { userId, total, correct, incorrect, detail } = req.body

    const simpleQuizResult = new QuizResult<SimpleQuiz>(total, correct, incorrect, detail)
    const quizResultApplication = new QuizResultApplication(userId)

    await quizResultApplication.updateSimpleQuizResult(simpleQuizResult)

    res.json({ result: 'success' })
  } catch(e) {
    console.error(e)
    res.status(500).json({ error: e.toString() })
  }
})

export default QuizRouter