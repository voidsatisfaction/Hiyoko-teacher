import * as sinon from 'sinon'
import { expect } from 'chai'

import { UserEntityMock, VocabularyEntityMock } from "../../../helper/factory"
import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client';
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db';
import { VocabularyListRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyListRepository'
import { CountSummaryRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/CountSummaryRepository';
import * as DateUtil from '../../../../src/util/Date'
import { CountSummaryEntity, CountCategory } from '../../../../src/hiyokoCore/domain/model/CountSummary';

class VocabularyListRepositoryTest extends VocabularyListRepositoryComponent {
  readonly dbc: IDbClient
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

class CountSummaryRepositoryTest extends CountSummaryRepositoryComponent {
  readonly dbc: IDbClient
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

describe('CountSummary repository test', () => {
  const dbc = new DbClient()
  const vocabularyListRepository = new VocabularyListRepositoryTest(dbc)
  const vocabularyListAction = vocabularyListRepository.vocabularyListRepository().vocabularyListAction()

  const countSummaryRepository = new CountSummaryRepositoryTest(dbc)
  const countSummaryLoader = countSummaryRepository.countSummaryRepository().countSummaryLoader()

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

      now.tick(48 * 60 * 60 * 1000)
      await vocabularyListAction.create(
        userEntity, vocabularyEntity1, meaning1, contextSentence1, contextPictureURL1, priority1
      )

      now.restore()

      const dates = DateUtil.getThisWeekDateStrings(now.Date())

      const countSummaries = await countSummaryLoader.findAll(userEntity.userId, CountCategory.addingVocabularyList, dates)

      expect(countSummaries.length).to.be.equal(7)
      expect(countSummaries[0]).to.be.instanceOf(CountSummaryEntity)
      expect(countSummaries[0].count).to.be.equal(2)
      expect(countSummaries[1].count).to.be.equal(1)
      expect(countSummaries[2].count).to.be.equal(0)
      expect(countSummaries[3].count).to.be.equal(1)
      expect(countSummaries[4].count).to.be.equal(0)
      expect(countSummaries[5].count).to.be.equal(0)
      expect(countSummaries[6].count).to.be.equal(0)
    })
  })

  after(() => {
    dbc.close()
  })
})