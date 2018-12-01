import * as request from 'supertest'
import * as sinon from 'sinon'
import { expect } from 'chai'

import app from '../../../src/hiyokoCore/server'

describe('/vocabularyLists', () => {
  describe('GET /vocabularyLists', () => {
    const now = sinon.useFakeTimers(new Date())
    const userId = '12312sadfadf3123'

    before(async () => {
      await request(app)
        .post('/users')
        .send({ userId })
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

      now.tick(0)
      await request(app)
        .post('/vocabularyLists')
        .send(payload1)

      now.tick(10 * 1000)
      await request(app)
        .post('/vocabularyLists')
        .send(payload2)

      now.tick(20 * 1000)
      await request(app)
        .post('/vocabularyLists')
        .send(payload3)

      now.restore()
    })

    it('should successfully show user vocabulary lists', (done) => {
      // TODO: persist user / add vocabularylists
      request(app)
        .get(`/vocabularyLists/${userId}/all`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          expect(res.body.length).to.be.equal(3)
          done()
        })
    })
  })

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
        .post('/users')
        .send({ userId: '12312312344' })
        .end(() => {
          request(app)
            .post('/vocabularyLists')
            .send(payload)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done()
              }
              expect(res.body.vocabularyList.userId).to.equal(payload.userId)
              expect(res.body.vocabularyList.name).to.equal('asdf')
              expect(res.body.vocabularyList.meaning).to.equal('뜻 입니다  2')
              expect(res.body.vocabularyList.contextSentence).to.equal('hello wlkefmlwk abcd efd wlkmflkm')
              done()
            })
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