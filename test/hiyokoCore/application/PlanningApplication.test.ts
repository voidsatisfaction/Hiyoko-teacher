import { expect } from 'chai'
import * as sinon from 'sinon'

import { PlanningApplication } from '../../../src/hiyokoCore/application/PlanningApplication'
import { UserEntityPersistMock, VocabularyListEntityPersistMock } from '../../helper/factory';
import { IDbClient } from '../../../src/hiyokoCore/interface/infrastructure/db';
import { ILoggerDBClient } from '../../../src/hiyokoCore/interface/infrastructure/LoggerDB';
import { IVocabularyListVocabularyRelationObject } from '../../../src/hiyokoCore/domain/relation/VocabularyListVocabularyRelation';
import { DateTime } from '../../../src/util/DateTime';
import { UserEntity } from '../../../src/hiyokoCore/domain/model/User';
import { CountCategory } from '../../../src/hiyokoCore/domain/model/CountSummary';

class PlanningApplicationTest extends PlanningApplication {
  readonly dbc: IDbClient
  readonly loggerDBC: ILoggerDBClient
  readonly vocabularyListVocabularyRelationObject: IVocabularyListVocabularyRelationObject
  readonly userId: string
  user: UserEntity

  constructor() {
    super('sdlf1ma;123123;fmkwl123')
    this.dbc = this.dbClient()
    this.loggerDBC = this.loggerDBClient()
    this.user = undefined
  }

  do() {
    describe('Planning application test', () => {
      before(async () => {
        this.user = await UserEntityPersistMock(this.dbc, this.userId)
      })

      beforeEach(async () => {
        await Promise.all([
          this.dbc.truncateTable(this.dbc.Vocabulary),
          this.dbc.truncateTable(this.dbc.VocabularyList),
          this.dbc.truncateTableRaw(this.dbc.CountSummaryTableName),
        ])
      })

      describe('getPlanAcheivement()', () => {
        it('should get all plans and achievements', async () => {
          this.countSummaryRepository().countSummaryAction().createOrUpdate(
            this.user, CountCategory.addingVocabularyList, new DateTime()
          )

          this.countSummaryRepository().countSummaryAction().createOrUpdate(
            this.user, CountCategory.addingVocabularyList, new DateTime()
          )

          this.countSummaryRepository().countSummaryAction().createOrUpdate(
            this.user, CountCategory.takingQuiz, new DateTime().add(1, 'days')
          )

          const planAcheivement = await this.getThisWeekPlanAcheivement()

          expect(planAcheivement.achievement.addVocabularyListCounts.length).to.equal(7)
          expect(planAcheivement.achievement.addVocabularyListCounts.reduce((acc, c) => acc + c.count, 0)).to.equal(2)
          expect(planAcheivement.achievement.takeQuizCounts.length).to.equal(7)
          expect(planAcheivement.achievement.takeQuizCounts.reduce((acc, c) => acc + c.count, 0)).to.equal(1)
        })
      })

      after(() => {
        this.dbc.close()
      })
    })
  }
}

const qat = new PlanningApplicationTest()
qat.do()