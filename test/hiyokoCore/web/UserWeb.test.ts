import * as request from 'supertest'
import { expect } from 'chai'

import app from '../../../src/hiyokoCore/server'

describe('/users', () => {
  describe('POST /users', () => {
    it('should successfully create user', (done) => {
      request(app)
        .post('/users')
        .send({ userId: '123123123', productId: 123 })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          expect(res.body.user.userId).to.equal('123123123')
          done()
        })
    })

    it('should be error with invalid body', (done) => {
      request(app)
        .post('/users')
        .send({ abcd: 'asfwef' })
        .set('Accept', 'application/json')
        .expect(400, done)
    })
  })
})