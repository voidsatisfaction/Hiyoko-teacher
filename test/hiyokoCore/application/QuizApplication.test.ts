import { expect } from 'chai';

import { QuizApplication, SimpleQuiz } from '../../../src/hiyokoCore/application/QuizApplication'
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
        await dbc.truncateTable(dbc.User)
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

      after(() => {
        dbc.close()
      })
    })
  }
}

const qat = new QuizApplicationTest()
qat.do()