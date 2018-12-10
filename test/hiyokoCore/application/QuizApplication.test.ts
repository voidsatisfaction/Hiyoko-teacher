import { expect } from 'chai'
import * as sinon from 'sinon'

import { QuizApplication, SimpleQuiz, ActiveVocabularyQuiz } from '../../../src/hiyokoCore/application/QuizApplication'
import { DbClient } from '../../../src/hiyokoCore/infrastructure/db/client';
import { UserEntityPersistMock, VocabularyListEntityPersistMock } from '../../helper/factory';
import { IDbClient } from '../../../src/hiyokoCore/interface/infrastructure/db';
import { ILoggerDBClient } from '../../../src/hiyokoCore/interface/infrastructure/LoggerDB';
import { IVocabularyListVocabularyRelationObject } from '../../../src/hiyokoCore/domain/relation/VocabularyListVocabularyRelation';

class QuizApplicationTest extends QuizApplication {
  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient
  readonly vocabularyListVocabularyRelationObject: IVocabularyListVocabularyRelationObject
  userId: string

  constructor() {
    super('123sdfasdkfmlk')
    this.dbc = this.dbClient()
    this.loggerDBC = this.loggerDBClient()
  }

  do() {
    describe('Quiz application test', () => {
      const dbc = new DbClient()
      const userId = '123sdfasdkfmlk'

      beforeEach(async () => {
        await Promise.all([
          dbc.truncateTable(dbc.User),
          dbc.truncateTable(dbc.Vocabulary),
          dbc.truncateTable(dbc.VocabularyList)
        ])
      })

      describe('createSimpleQuizzes()', () => {
        it('should create simple quizzes', async () => {
          const userEntity = await UserEntityPersistMock(dbc, this.userId)
          const [vocabularyList1, vocabularyList2, vocabularyList3] = await Promise.all([
            VocabularyListEntityPersistMock(this.dbc, userEntity),
            VocabularyListEntityPersistMock(this.dbc, userEntity),
            VocabularyListEntityPersistMock(this.dbc, userEntity)
          ])

          const simpleQuizzes = await this.getSimpleQuizzes()

          expect(simpleQuizzes.length).to.be.equal(3)
        })
      })

      describe('createCompositeQuizzes()', () => {
        it('should create composite quizzes', async () => {
          const now = sinon.useFakeTimers(new Date())
          const userEntity = await UserEntityPersistMock(dbc, this.userId)
          const meaning = 'meaning'

          const name1 = 'turned down'
          const contextSentence1 = 'you guys turned down my offer right?'

          const name2 = 'offered'
          const contextSentence2 = 'why you got offered, but not joining the company?'

          const name3 = 'swimming'
          const contextSentence3 = 'swimming is one of my favourite hobby!'

          now.tick(10 * 1000)
          const vocabularyList1 = await VocabularyListEntityPersistMock(this.dbc, userEntity, name1, meaning, contextSentence1, 100)
          now.tick(10 * 1000)
          const vocabularyList2 = await VocabularyListEntityPersistMock(this.dbc, userEntity, name1, meaning, contextSentence1, 90)
          now.tick(10 * 1000)
          const vocabularyList3 = await VocabularyListEntityPersistMock(this.dbc, userEntity, name1, meaning, contextSentence1, 80)
          now.tick(10 * 1000)
          const vocabularyList4 = await VocabularyListEntityPersistMock(this.dbc, userEntity, name1, meaning, contextSentence1, 70)
          now.tick(10 * 1000)
          const vocabularyList5 = await VocabularyListEntityPersistMock(this.dbc, userEntity, name2, meaning, contextSentence2, 60)
          now.tick(10 * 1000)
          const vocabularyList6 = await VocabularyListEntityPersistMock(this.dbc, userEntity, name3, meaning, contextSentence3, 50)

          const compositeQuizzes = await this.createCompositeQuizzes()

          now.restore()

          expect(compositeQuizzes.length).to.equal(6)
          expect(compositeQuizzes[0]).to.be.instanceOf(SimpleQuiz)
          expect(compositeQuizzes[3]).to.be.instanceOf(ActiveVocabularyQuiz)

          expect(compositeQuizzes[3].problem).to.be.equal('you guys tu____ ____ my offer right?')
          expect(compositeQuizzes[3].answer).to.be.equal('rned down')
          expect(compositeQuizzes[4].problem).to.be.equal('why you got off____, but not joining the company?')
          expect(compositeQuizzes[4].answer).to.be.equal('ered')
          expect(compositeQuizzes[5].problem).to.be.equal('swi_____ is one of my favourite hobby!')
          expect(compositeQuizzes[5].answer).to.be.equal('mming')
        })
      })

      after(() => {
        dbc.close()
      })
    })
  }
}

const qat = new QuizApplicationTest()
qat.do()