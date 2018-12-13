import { expect } from 'chai'

import { PlanningApplication, CountSummary, CountPlan } from '../../../src/hiyokoCore/application/PlanningApplication'
import { UserEntityPersistMock } from '../../helper/factory';
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

      describe('getThisWeekPlanAchievement()', () => {
        it('should get all plans and achievements', async () => {
          this.countSummaryRepository().countSummaryAction().createOrUpdate(
            this.user, CountCategory.addingVocabularyList, new DateTime()
          )

          this.countSummaryRepository().countSummaryAction().createOrUpdate(
            this.user, CountCategory.addingVocabularyList, new DateTime()
          )

          this.countSummaryRepository().countSummaryAction().createOrUpdate(
            this.user, CountCategory.takingQuiz, new DateTime()
          )

          this.countSummaryRepository().countSummaryAction().createOrUpdate(
            this.user, CountCategory.planAddingVocabularyList, new DateTime()
          )

          this.countSummaryRepository().countSummaryAction().createOrUpdate(
            this.user, CountCategory.planTakingQuiz, new DateTime()
          )

          const planAcheivement = await this.getThisWeekPlanAchievement()

          expect(planAcheivement.toJSON().achievement[CountCategory.addingVocabularyList].length).to.equal(7)
          expect(planAcheivement.toJSON().achievement[CountCategory.addingVocabularyList].reduce((acc, c) => acc + c.count, 0)).to.equal(2)
          expect(planAcheivement.toJSON().achievement[CountCategory.takingQuiz].length).to.equal(7)
          expect(planAcheivement.toJSON().achievement[CountCategory.takingQuiz].reduce((acc, c) => acc + c.count, 0)).to.equal(1)

          expect(planAcheivement.toJSON().plan[CountCategory.planAddingVocabularyList].length).to.equal(7)
          expect(planAcheivement.toJSON().plan[CountCategory.planAddingVocabularyList].reduce((acc, c) => acc + c.count, 0)).to.equal(1)
          expect(planAcheivement.toJSON().plan[CountCategory.planTakingQuiz].length).to.equal(7)
          expect(planAcheivement.toJSON().plan[CountCategory.planTakingQuiz].reduce((acc, c) => acc + c.count, 0)).to.equal(1)
        })
      })

      describe('setCountPlans()', () => {
        it('should set this week\'s count plans', async () => {
          const user = await UserEntityPersistMock(this.dbc)
          this.user = user

          const countPlan2 = new CountPlan(user.userId, CountCategory.planAddingVocabularyList, new DateTime(), 3)
          const countPlan3 = new CountPlan(user.userId, CountCategory.planTakingQuiz, new DateTime(), 4)

          const countPlans = [countPlan2, countPlan3]

          await this.setCountPlans(countPlans)

          const planAchievement = await this.getThisWeekPlanAchievement()

          expect(planAchievement.toJSON().plan[CountCategory.planAddingVocabularyList].filter(p => p.count === 3)[0].count).to.equal(3)
          expect(planAchievement.toJSON().plan[CountCategory.planTakingQuiz].filter(p => p.count === 4)[0].count).to.equal(4)

          const countPlan4 = new CountPlan(user.userId, CountCategory.planAddingVocabularyList, new DateTime(), 1)
          const countPlan5 = new CountPlan(user.userId, CountCategory.planTakingQuiz, new DateTime(), 0)

          const countPlans2 = [countPlan4, countPlan5]

          await this.setCountPlans(countPlans2)

          const planAchievement2 = await this.getThisWeekPlanAchievement()

          expect(planAchievement2.toJSON().plan[CountCategory.planAddingVocabularyList].filter(p => p.count === 1)[0].count).to.equal(1)
          expect(planAchievement2.toJSON().plan[CountCategory.planTakingQuiz].filter(p => p.count === 0)[0].count).to.equal(0)
        })
      })
    })
  }
}

const qat = new PlanningApplicationTest()
qat.do()