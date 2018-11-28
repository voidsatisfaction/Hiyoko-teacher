import * as request from 'supertest'
import { expect } from 'chai'

import app from '../../../src/hiyokoCore/server'

describe('/vocabularyLists', () => {
  describe('POST /vocabularyLists', () => {
    it('should successfully create vocabularyList', (done) => {
      const payload = {
        userId: '123123123',
        name: 'abcd efd',
        meaning: '뜻1 입니다',
        contextSentence: 'hell o wlkefmlwk abcd efd wlkmflkm'
      }
      request(app)
        .post('/vocabularyLists')
        .send(payload)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          expect(res.body.vocabularyList.userId).to.equal(payload.userId)
          expect(res.body.vocabularyList.name).to.equal(payload.name)
          expect(res.body.vocabularyList.meaning).to.equal(payload.meaning)
          expect(res.body.vocabularyList.contextSentence).to.equal(payload.contextSentence)
          done()
        })
    })

    it('should successfully create vocabularyList with white spaces', (done) => {
      const payload = {
        userId: '12312312344',
        name: '    asdf    ',
        meaning: '       뜻 입니다  2   ',
        contextSentence: '      hello wlkefmlwk abcd efd wlkmflkm  '
      }
      request(app)
        .post('/vocabularyLists')
        .send(payload)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          expect(res.body.vocabularyList.userId).to.equal(payload.userId)
          expect(res.body.vocabularyList.name).to.equal('asdf')
          expect(res.body.vocabularyList.meaning).to.equal('뜻 입니다  2')
          expect(res.body.vocabularyList.contextSentence).to.equal('hello wlkefmlwk abcd efd wlkmflkm')
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