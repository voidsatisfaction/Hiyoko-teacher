import * as express from 'express'
import { validationResult, check } from 'express-validator/check'
import { VocabularyListApplication } from '../application/VocabularyListApplication';

const VocabularyListRouter = express.Router()

VocabularyListRouter.get('/:userId/all', [
  check('userId').exists().isString()
], async (req: express.Request, res: express.Response) => {
  try {
    const bodyErrors = validationResult(req)
    if (!bodyErrors.isEmpty()) {
      return res.status(400).json({ errors: bodyErrors.array() })
    }

    const userId = req.params.userId

    const vocabularyListApplication = new VocabularyListApplication(userId)
    const userVocabularyLists = await vocabularyListApplication.getUserVocabularyLists()

    res.json(userVocabularyLists)
  } catch(e) {
    res.status(500).json({ error: e.toString() })
  }
})

VocabularyListRouter.post('/', [
  check('userId').isString().trim(),
  check('name').isString().trim(),
  check('meaning').isString().trim(),
  check('contextSentence').isString().trim()
], async (req: express.Request, res: express.Response) => {
  try {
    const bodyErrors = validationResult(req)
    if (!bodyErrors.isEmpty()) {
      return res.status(400).json({ errors: bodyErrors.array() })
    }

    const userId: string = req.body.userId
    const name: string = req.body.name
    const meaning: string = req.body.meaning
    const contextSentence: string | null = req.body.contextSentence || null

    const vocabularyListApplication = new VocabularyListApplication(userId)
    const vocabularyList = await vocabularyListApplication.addVocabularyToList(name, meaning, contextSentence)

    res.json({ vocabularyList })
  } catch(e) {
    res.status(500).json({ error: e.toString() })
  }
})

export default VocabularyListRouter