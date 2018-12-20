import * as sinon from 'sinon'
import { expect } from 'chai'

import { UserEntityMock, VocabularyEntityMock } from "../../../helper/factory"
import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client';
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db';
import { VocabularyListRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/VocabularyListRepository'
import { CountSummaryRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/CountSummaryRepository';
import { DateTime } from '../../../../src/util/DateTime'
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
  const countSummaryAction = countSummaryRepository.countSummaryRepository().countSummaryAction()

  beforeEach(async () => {
    await Promise.all([
      dbc.truncateTable(dbc.Vocabulary),
      dbc.truncateTable(dbc.VocabularyList)
    ])
  })

  describe('createOrUpdate()', () => {
    it('should create and increase count of countSummary', async () => {
      const userEntity1 = UserEntityMock()
      const dateTime = new DateTime()
      const dateTimeTomorrow = dateTime.add(1, 'days')

      await countSummaryAction.createOrUpdate(
        userEntity1,
        CountCategory.addingVocabularyList,
        dateTime
      )

      await countSummaryAction.createOrUpdate(
        userEntity1,
        CountCategory.addingVocabularyList,
        dateTime
      )

      await countSummaryAction.createOrUpdate(
        userEntity1,
        CountCategory.takingQuiz,
        dateTime
      )

      await countSummaryAction.createOrUpdate(
        userEntity1,
        CountCategory.takingQuiz,
        dateTimeTomorrow
      )

      const [countSummary1, countSummary2, countSummary3, countSummary4] = await Promise.all([
        countSummaryLoader.find(
          userEntity1.userId,
          CountCategory.addingVocabularyList,
          dateTime.toDateString()
        ),
        countSummaryLoader.find(
          userEntity1.userId,
          CountCategory.takingQuiz,
          dateTime.toDateString()
        ),
        countSummaryLoader.find(
          userEntity1.userId,
          CountCategory.takingQuiz,
          dateTimeTomorrow.toDateString()
        ),
        countSummaryLoader.find(
          userEntity1.userId,
          CountCategory.addingVocabularyList,
          dateTimeTomorrow.toDateString()
        ),
      ])

      expect(countSummary1.count).to.be.equal(2)
      expect(countSummary2.count).to.be.equal(1)
      expect(countSummary3.count).to.be.equal(1)
      expect(countSummary4.count).to.be.equal(0)
    })
  })

  describe('bulkCreateOrUpdate()', () => {
    it('should bulkCreateOrUpdate countSummary', async () => {
      const userEntity = UserEntityMock()
      const countSummary1 = new CountSummaryEntity(userEntity.userId, CountCategory.planAddingVocabularyList, new DateTime('2018-10-10'), 5)
      const countSummary2 = new CountSummaryEntity(userEntity.userId, CountCategory.planAddingVocabularyList, new DateTime('2018-10-11'), 2)
      const countSummary3 = new CountSummaryEntity(userEntity.userId, CountCategory.planAddingVocabularyList, new DateTime('2018-10-12'), 1)

      const countSummaries = [countSummary1, countSummary2, countSummary3]

      await countSummaryAction.bulkCreateOrUpdate(
        userEntity,
        countSummaries
      )

      const foundCountSummaryEntities = await countSummaryLoader.findAll(
        userEntity.userId,
        countSummary1.countCategory,
        ['2018-10-10', '2018-10-11', '2018-10-12']
      )

      expect(foundCountSummaryEntities).to.be.deep.equal(countSummaries)

      const countSummary4 = new CountSummaryEntity(userEntity.userId, CountCategory.planAddingVocabularyList, new DateTime('2018-10-10'), 15)
      const countSummary5 = new CountSummaryEntity(userEntity.userId, CountCategory.planAddingVocabularyList, new DateTime('2018-10-11'), 0)
      const countSummary6 = new CountSummaryEntity(userEntity.userId, CountCategory.planAddingVocabularyList, new DateTime('2018-10-12'), 1)

      const countSummaries2 = [countSummary4, countSummary5, countSummary6]

      await countSummaryAction.bulkCreateOrUpdate(
        userEntity,
        countSummaries2
      )

      const foundCountSummaryEntities2 = await countSummaryLoader.findAll(
        userEntity.userId,
        countSummary4.countCategory,
        ['2018-10-10', '2018-10-11', '2018-10-12']
      )

      expect(foundCountSummaryEntities2).to.be.deep.equal(countSummaries2)
    })
  })

  describe('findAll()', () => {
    it('should findAll countSummary added count which was increased', async () => {
      const now = sinon.useFakeTimers(DateTime.getThisWeekMondayDateTime(new DateTime()).toDate())

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

      const dates = DateTime.getThisWeekDateStrings(new DateTime(now.Date()))

      const addingVocabularyListCounts = await countSummaryLoader.findAll(userEntity.userId, CountCategory.addingVocabularyList, dates)

      expect(addingVocabularyListCounts.length).to.be.equal(7)
      expect(addingVocabularyListCounts[0]).to.be.instanceOf(CountSummaryEntity)
      expect(addingVocabularyListCounts[0].count).to.be.equal(2)
      expect(addingVocabularyListCounts[1].count).to.be.equal(1)
      expect(addingVocabularyListCounts[2].count).to.be.equal(0)
      expect(addingVocabularyListCounts[3].count).to.be.equal(1)
      expect(addingVocabularyListCounts[4].count).to.be.equal(0)
      expect(addingVocabularyListCounts[5].count).to.be.equal(0)
      expect(addingVocabularyListCounts[6].count).to.be.equal(0)
    })
  })

  describe('findAllPlansByUserIdsAndDate()', () => {
    it('should find all plans by userIds and date', async () => {
      const userEntity1 = UserEntityMock()
      const userEntity2 = UserEntityMock()
      const countSummary1 = new CountSummaryEntity(userEntity1.userId, CountCategory.planAddingVocabularyList, new DateTime('2018-10-10'), 5)
      const countSummary2 = new CountSummaryEntity(userEntity1.userId, CountCategory.planAddingVocabularyList, new DateTime('2018-10-11'), 2)
      const countSummary3 = new CountSummaryEntity(userEntity2.userId, CountCategory.planAddingVocabularyList, new DateTime('2018-10-10'), 1)

      const countSummaries1 = [countSummary1, countSummary2]
      const countSummaries2 = [countSummary3]

      await Promise.all([
        countSummaryAction.bulkCreateOrUpdate(
          userEntity1,
          countSummaries1
        ),
        countSummaryAction.bulkCreateOrUpdate(
          userEntity2,
          countSummaries2
        ),
      ])

      const foundCountSummaries = await countSummaryLoader.findAllByCountCategoryAndUserIdsAndDate(
        [userEntity1.userId, userEntity2.userId],
        CountCategory.planAddingVocabularyList,
        '2018-10-10'
      )

      expect(foundCountSummaries.length).to.be.equal(2)
    })
  })

  after(() => {
    dbc.close()
  })
})