import { expect } from 'chai'

import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { UserProductRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/UserProductImplement'
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db'
import { UserProductEntity } from '../../../../src/hiyokoCore/domain/model/User';

class UserProductRepositoryTest extends UserProductRepositoryComponent {
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

describe('UserProduct repository test', () => {
  const dbc = new DbClient()
  const userRepositoryTest = new UserProductRepositoryTest(dbc)
  const userRepository = userRepositoryTest.userProductRepository()
  const userProductAction = userRepository.userProductAction()
  const userProductLoader = userRepository.userProductLoader()

  beforeEach(async () => {
    await dbc.truncateTable(dbc.UserProduct)
  })

  describe('findByUserIds()', () => {
    it('should find by userIds', async () => {
      const userId1 = 'skldfjlskl123'
      const productId1 = 1

      const userId2 = 'sldkfsdmlkmdl'
      const productId2 = 1

      await userProductAction.create(userId1, productId1)
      await userProductAction.create(userId2, productId2)

      const foundUserProducts = await userProductLoader.findAllByProductId(1)

      expect(foundUserProducts.length).to.be.equal(2)
      expect(foundUserProducts[0]).to.be.instanceOf(UserProductEntity)
    })
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