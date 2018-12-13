import { expect } from 'chai'
import * as sinon from 'sinon'

import { QuizResultApplication, QuizResult } from '../../../src/hiyokoCore/application/QuizResultApplication';
import { IDbClient } from '../../../src/hiyokoCore/interface/infrastructure/db';
import { ILoggerDBClient } from '../../../src/hiyokoCore/interface/infrastructure/LoggerDB';
import { VocabularyListEntityPersistMock, UserEntityMock, UserEntityPersistMock } from '../../helper/factory';
import { SimpleQuiz } from '../../../src/hiyokoCore/application/QuizApplication';
import { DateTime } from '../../../src/util/DateTime';

class QuizResultApplicationTest extends QuizResultApplication {
  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient
  userId: string

  constructor() {
    super('123123sf34123t24')
    this.dbc = this.dbClient()
    this.loggerDBC = this.loggerDBClient()
  }

  do() {
    describe('Quiz Result Application Test', () => {
      beforeEach(async () => {
        await this.dbc.truncateTable(this.dbc.User)
      })

      describe('updateSimpleQuizResult()', async () => {
        it('should properly update quiz result', async () => {
          const now = sinon.useFakeTimers(new DateTime().toDate())
          const user = await UserEntityPersistMock(this.dbc, this.userId)
          const name = 'name'
          const meaning = 'meaning'
          const contextSentence = 'contextSentence'

          now.tick(0)
          const createdAt1 = new DateTime()

          now.tick(10 * 1000)
          const createdAt2 = new DateTime()

          now.tick(10 * 1000)
          const createdAt3 = new DateTime()

          now.tick(10 * 1000)
          const createdAt4 = new DateTime()

          now.restore()

          const [a, vocabularyList1] = await VocabularyListEntityPersistMock(this.dbc, user, name, meaning, contextSentence, 40, createdAt1)
          const [b, vocabularyList2] = await VocabularyListEntityPersistMock(this.dbc, user, name, meaning, contextSentence, 60, createdAt2)
          const [c, vocabularyList3] = await VocabularyListEntityPersistMock(this.dbc, user, name, meaning, contextSentence, 80, createdAt3)
          const [d, vocabularyList4] = await VocabularyListEntityPersistMock(this.dbc, user, name, meaning, contextSentence, 100, createdAt4)

          const simpleQuiz1 = new SimpleQuiz(vocabularyList1.vocaListId, 'asdlkfm', 'alsdkmf')
          const simpleQuiz2 = new SimpleQuiz(vocabularyList2.vocaListId, 'asdlkfm', 'alsdkmf')
          const simpleQuiz3 = new SimpleQuiz(vocabularyList3.vocaListId, 'asdlkfm', 'alsdkmf')
          const simpleQuiz4 = new SimpleQuiz(vocabularyList4.vocaListId, 'asdlkfm', 'alsdkmf')

          const simpleQuizResult = new QuizResult<SimpleQuiz>(
            4, 2, 2, [
              { quiz: simpleQuiz1, correct: true },
              { quiz: simpleQuiz2, correct: false },
              { quiz: simpleQuiz3, correct: false },
              { quiz: simpleQuiz4, correct: true },
            ]
          )

          await this.updateSimpleQuizResult(simpleQuizResult)

          const [afterVocabularyList1, afterVocabularyList2, afterVocabularyList3, afterVocabularyList4] = await this.vocabularyListRepository().vocabularyListLoader().findAll([
            vocabularyList1.vocaListId, vocabularyList2.vocaListId, vocabularyList3.vocaListId, vocabularyList4.vocaListId,
          ])

          expect(afterVocabularyList1.priority).to.be.equal(20)
          expect(afterVocabularyList2.priority).to.be.equal(80)
          expect(afterVocabularyList3.priority).to.be.equal(90)
          expect(afterVocabularyList4.priority).to.be.equal(50)
        })
      })
    })
  }
}

const qrat = new QuizResultApplicationTest()
qrat.do()