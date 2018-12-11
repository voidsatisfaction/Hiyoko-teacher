import * as sinon from 'sinon'
import { expect } from 'chai'

import { UserEntityMock, VocabularyEntityMock } from "../../../helper/factory"
import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client';
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db';
import { VocabularyListRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyListRepository'
import { UserVocabularyListAddedCountRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/UserVocabularyListAddedCountRepository';
import * as DateUtil from '../../../../src/util/Date'
import { UserVocabularyListAddedCountEntity } from '../../../../src/hiyokoCore/domain/model/UserVocabularyListAddedCount';

class VocabularyListRepositoryTest extends VocabularyListRepositoryComponent {
  readonly dbc: IDbClient
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

class UserVocabularyListAddedCountRepositoryTest extends UserVocabularyListAddedCountRepositoryComponent {
  readonly dbc: IDbClient
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

describe('UserVocabularyListAddedCount repository test', () => {
  const dbc = new DbClient()
  const vocabularyListRepository = new VocabularyListRepositoryTest(dbc)
  const vocabularyListAction = vocabularyListRepository.vocabularyListRepository().vocabularyListAction()

  const userVocabularyListAddedCountRepository = new UserVocabularyListAddedCountRepositoryTest(dbc)
  const userVocabularyListAddedCountLoader = userVocabularyListAddedCountRepository.userVocabularyListAddedCountRepository().userVocabulayListAddedCountLoader()

  beforeEach(async () => {
    await Promise.all([
      dbc.truncateTable(dbc.Vocabulary),
      dbc.truncateTable(dbc.VocabularyList)
    ])
  })

  describe('create()', () => {
    it('should create vocabularyList and vocabualryLists added count also increased', async () => {
      const now = sinon.useFakeTimers(DateUtil.getThisWeekMondayDate(new Date()))

      const userEntity = UserEntityMock()
      const vocabularyEntity1 = VocabularyEntityMock()
      const meaning1 = 'よくわからないけどね'
      const contextSentence1 = 'there is no one in here hello world!'
      const contextPictureURL1 = 'http://helloWOrld.com/picture.jpg'
      const priority1 = 50

      now.tick(0)
      await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1, priority1
      )

      now.tick(1000)
      await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1, priority1
      )

      now.tick(24 * 60 * 60 * 1000)
      await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1, priority1
      )

      now.tick(24 * 60 * 60 * 1000)
      await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1, priority1
      )

      now.restore()

      const dates = DateUtil.getThisWeekDateString(now.Date())

      const userVocabularyListAddedCounts = await userVocabularyListAddedCountLoader.findAll(userEntity.userId, dates)

      console.log(userVocabularyListAddedCounts)

      expect(userVocabularyListAddedCounts.length).to.be.equal(3)
      expect(userVocabularyListAddedCounts[0]).to.be.instanceOf(UserVocabularyListAddedCountEntity)
      expect(userVocabularyListAddedCounts[0].count).to.be.equal(2)
      expect(userVocabularyListAddedCounts[1].count).to.be.equal(1)
      expect(userVocabularyListAddedCounts[2].count).to.be.equal(1)
    })
  })

  after(() => {
    dbc.close()
  })
})