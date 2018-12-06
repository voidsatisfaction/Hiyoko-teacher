import { expect } from 'chai'

import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { UserProductRepositoryImplement } from '../../../../src/hiyokoCore/infrastructure/db/UserProductImplement'
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db'

class UserProductRepositoryTest extends UserProductRepositoryImplement {
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

describe('UserProduct repository test', () => {
  const dbc = new DbClient()
  const userRepository = new UserProductRepositoryTest(dbc)
  const userProductLoader = userRepository.userProductLoader()
  const userProductAction = userRepository.userProductAction()

  beforeEach(async () => {
    await dbc.truncateTable(dbc.UserProduct)
  })

  describe('findByUserId()', () => {
    it('should find by userId', async () => {
      const userId = 'testtestid'
      const productId = 1

      const createdUserProduct = await userProductAction.create(userId, productId)
      const foundUserProudct = await userProductLoader.findByUserId(createdUserProduct.userId)

      expect(createdUserProduct).to.be.deep.equal(foundUserProudct)
    })
  })

  after(() => {
    dbc.close()
  })
})