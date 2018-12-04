import * as request from 'supertest'

import app from '../../../src/hiyokoCore/server'

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
})