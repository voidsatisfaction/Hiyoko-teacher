import * as request from 'supertest'
import { expect } from 'chai'

import app from '../../../src/hiyokoCore/server'
import { CountCategory } from '../../../src/hiyokoCore/domain/model/CountSummary';
import { DbClient } from '../../../src/hiyokoCore/infrastructure/db/client';

describe('/userSetting', () => {
  const userId = 'skfnwken123asdf'
  const dbc = new DbClient()

  beforeEach(async () => {
    await dbc.truncateTableRaw(dbc.CountSummaryTableName)
  })

  describe('GET userSetting/planning/:userId', () => {
    it('should successfully get user achievement and planning', async () => {
      await request(app)
        .post('/users')
        .send({ userId, productId: 123 })
        .set('Accept', 'application/json')
        .expect(200)

      const payload1 = {
        userId,
        name: 'abcd efd',
        meaning: '뜻1 입니다',
        contextSentence: 'hell o wlkefmlwk abcd efd wlkmflkm'
      }

      const payload2 = {
        userId,
        name: 'asdfasdfawwf efd',
        meaning: '뜻1 wefwefw',
        contextSentence: 'hell o wefqwefqwefqe abcd efd wlkmflkm'
      }

      await request(app)
        .post('/vocabularyLists')
        .send(payload1)
        .set('Accept', 'application/json')
        .expect(200)

      await request(app)
        .post('/vocabularyLists')
        .send(payload2)
        .set('Accept', 'application/json')
        .expect(200)

      const payload3 = {
        userId,
        total: 4,
        correct: 2,
        incorrect: 2,
        detail: []
      }

      await request(app)
        .post('/quizzes/simple/result')
        .send(payload3)
        .set('Accept', 'application/json')
        .expect(200)

      const res = await request(app)
        .get(`/userSetting/planning/${userId}`)
        .expect(200)

      expect(res.body.planAchievement).to.exist
    })
  })

  describe('POST userSetting/planning/count', () => {
    it('should successfully set count plannings', async () => {
      const payload = {
        userId,
        countPlans: [{
          countCategory: CountCategory.planAddingVocabularyList,
          date: '2018-10-10',
          count: 10
        }, {
          countCategory: CountCategory.planTakingQuiz,
          date: '2018-10-11',
          count: 2
        }]
      }

      await request(app)
        .post(`/userSetting/planning/count`)
        .send(payload)
        .expect(200)
        .set('Accept', 'application/json')
    })
  })

  after(async () => {
    await dbc.close()
  })
})