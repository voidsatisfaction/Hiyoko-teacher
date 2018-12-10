import * as request from 'supertest'
import { expect } from 'chai'

import app from '../../../src/hiyokoCore/server'
import { DbClient } from '../../../src/hiyokoCore/infrastructure/db/client';

describe('/quizzes', () => {
  const dbc = new DbClient()
  const userId = '12312sadfadf3123'
  const productId = 1

  before(async () => {
    await Promise.all([
      dbc.truncateTable(dbc.VocabularyList)
    ])

    await request(app)
      .post('/users')
      .send({ userId, productId })
      .set('Accept', 'application/json')

    const payload1 = {
      userId,
      name: 'abcd efd',
      meaning: '뜻1 입니다',
      contextSentence: 'hell o wlkefmlwk abcd efd wlkmflkm'
    }

    const payload2 = {
      userId,
      name: 'name2',
      meaning: '뜻2 입니다',
      contextSentence: 'hell o wlkefmlwk abcd efd wlkmflkm22222'
    }

    const payload3 = {
      userId,
      name: 'name3',
      meaning: '뜻3 입니다',
      contextSentence: 'hell o wlkefmlwk abcd efd 33333'
    }

    await request(app)
      .post('/vocabularyLists')
      .send(payload1)
      .set('Accept', 'application/json')

    await request(app)
      .post('/vocabularyLists')
      .send(payload2)
      .set('Accept', 'application/json')

    await request(app)
      .post('/vocabularyLists')
      .send(payload3)
      .set('Accept', 'application/json')
  })

  describe('GET /quizzes/simple', () => {
    it('should successfully get simple quizzes', async () => {
      const res = await request(app)
        .get('/quizzes/simple')
        .query({
          userId
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.quizzes.length).to.be.equal(3)
    })
  })

  describe('GET /quizzes/composite', () => {
    it('should successfully get composite quizzes', async () => {
      const res = await request(app)
        .get('/quizzes/composite')
        .query({
          userId
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.quizzes.length).to.be.equal(3)
    })
  })

  describe('POST /quizzes/simple/result', () => {
    it('should successfully update simple quizzes result with empty payload', async () => {
      const payload = {
        userId,
        total: 4,
        correct: 2,
        incorrect: 2,
        detail: []
      }
      const res = await request(app)
        .post('/quizzes/simple/result')
        .send(payload)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.result).to.be.equal('success')
    })

    // TODO: with parameter should be tested
  })

  describe('POST /quizzes/composite/result', () => {
    it('should successfully update composite quizzes result with empty payload', async () => {
      const payload = {
        userId,
        total: 5,
        correct: 3,
        incorrect: 2,
        detail: []
      }
      const res = await request(app)
        .post('/quizzes/composite/result')
        .send(payload)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.result).to.be.equal('success')
    })

    // TODO: with parameter should be tested
  })
})