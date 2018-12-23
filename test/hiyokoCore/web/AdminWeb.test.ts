import * as request from 'supertest'
import { expect } from 'chai'

import app from '../../../src/hiyokoCore/server'
import { CountCategory } from '../../../src/hiyokoCore/domain/model/CountSummary';
import { DateTime } from '../../../src/util/DateTime';

describe('/admin', () => {
  it('should not accessed without admin-token', (done) => {
    request(app)
      .get('/admin/users/all')
      .set('Accept', 'application/json')
      .expect(404, done)
  })

  describe('GET /admin/users/all', () => {
    it('should not get use without proper admin-token', async () => {
      await request(app)
        .get('/admin/users/all')
        .set('Accept', 'application/json')
        .set('admin-token', '???')
        .expect(404)
    })

    it('should successfully get all users', async () => {
      await request(app)
        .get('/admin/users/all')
        .set('Accept', 'application/json')
        .set('admin-token', '123')
        .expect(200)
    })
  })

  describe('GET /admin/users/countSummaries', () => {
    before(async () => {
      await request(app)
        .post('/users')
        .send({ userId: '123123123', productId: 123 })
        .set('Accept', 'application/json')
    })

    it('should get all countSummaries', async () => {
      const res = await request(app)
        .get('/admin/users/countSummaries?userId[]=123123123')
        .set('Accept', 'application/json')
        .set('admin-token', '123')
        .query({
          countCategory: CountCategory.addingVocabularyList,
          date: new DateTime().toDateString()
        })
        .expect(200)

      expect(res.body[0].userId).to.be.equal('123123123')
      expect(res.body[0].countSummary).to.be.equal(null)
    })
  })
})