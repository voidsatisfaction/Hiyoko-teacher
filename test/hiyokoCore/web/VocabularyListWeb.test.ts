import * as request from 'supertest'
import * as sinon from 'sinon'
import { expect } from 'chai'

import app from '../../../src/hiyokoCore/server'
import { DateTime } from '../../../src/util/DateTime';

describe('/vocabularyLists', () => {

  const userId = '12312sadfadf3123123123'
  const productId = 1
  const userId2 = 'lskadmflmwkel12930u'
  const productId2 = 2
  before (async () => {
    await request(app)
      .post('/users')
      .send({ userId, productId })
      .set('Accept', 'application/json')

    await request(app)
      .post('/users')
      .send({ userId: userId2, productId: productId2 })
      .set('Accept', 'application/json')
  })

  describe('GET /vocabularyLists', () => {
    const now = sinon.useFakeTimers(new DateTime().toDate())

    before(async () => {
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

  describe('PUT /vocabularyLists', () => {
    let res
    before(async () => {
      const createPayload = {
        userId,
        name: 'wlekmflwmeflw',
        meaning: 'flkmf2l3km',
        contextSentence: 'lkmlkmflm'
      }

      res = await request(app)
        .post('/vocabularyLists')
        .send(createPayload)
        .set('Accept', 'application/json')
        .expect(200)
    })

    it('should be error when userId is not matched', async () => {
      const updatePayload = {
        userId: 'not matched userId123',
        vocaListId: res.body.vocabularyList.vocaListId,
        meaning: 'wfjnekksdmlfad',
        contextSentence: 'ksdflk'
      }

      await request(app)
        .put('/vocabularyLists')
        .send(updatePayload)
        .set('Accept', 'application/json')
        .expect(403)
        .then((res2) => {
          expect(res2.status).to.be.equal(403)
        })
    })

    it('should edit vocabularyList', async () => {
      const createdVocabularyList = res.body.vocabularyList
      const newMeaning = 'hello this is new meaning'
      const newContextSentence = 'ldkfjslkdfjsldjflskjl'

      const updatePayload = {
        userId,
        vocaListId: createdVocabularyList.vocaListId,
        meaning: newMeaning,
        contextSentence: newContextSentence
      }

      const res2 = await request(app)
        .put('/vocabularyLists')
        .send(updatePayload)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res2.body.vocabularyList.meaning).to.be.equal(newMeaning)
      expect(res2.body.vocabularyList.contextSentence).to.be.equal(newContextSentence)
    })
  })

  describe('DELETE /vocabularyLists', () => {
    it('should not delete with different userId', async () => {
      const createPayload = {
        userId,
        name: 'asldkfmalw',
        meaning: 'welfkmwleflwe',
        contextSentence: 'wefwfwef weeee qwe12e'
      }

      const res = await request(app)
        .post('/vocabularyLists')
        .send(createPayload)
        .set('Accept', 'application/json')
        .expect(200)

      const deletePayload = {
        userId: userId2,
        vocaListId: res.body.vocabularyList.vocaListId
      }

      await request(app)
        .delete('/vocabularyLists')
        .send(deletePayload)
        .set('Accept', 'application/json')
        .expect(403)
        .then((res2) => {
          expect(res2.status).to.be.equal(403)
        })
    })

    it('should delete with proper parameters', async () => {
      const createPayload = {
        userId,
        name: 'wlkemflwemklk',
        meaning: 'meaning',
        contextSentence: 'lkmfglakwmglemkfl welkfmwlefm wlemkf'
      }

      const res = await request(app)
        .post('/vocabularyLists')
        .send(createPayload)
        .set('Accept', 'application/json')
        .expect(200)

      const deletePayload = {
        userId,
        vocaListId: res.body.vocabularyList.vocaListId
      }

      await request(app)
        .delete('/vocabularyLists')
        .send(deletePayload)
        .set('Accept', 'application/json')
        .expect(200)
        .then((res2) => {
          expect(res2.body.result).to.be.equal('success')
        })
    })
  })
})