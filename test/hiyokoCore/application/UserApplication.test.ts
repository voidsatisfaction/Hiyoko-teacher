import { expect } from 'chai';

import { UserApplication } from '../../../src/hiyokoCore/application/UserApplication'
import { UserEntity } from '../../../src/hiyokoCore/domain/model/User';
import { DbClient } from '../../../src/hiyokoCore/infrastructure/db/client';
import { UserEntityPersistMock } from '../../helper/factory';

describe('User application test', () => {
  const dbc = new DbClient()
  const userId = '123sdfasdkfmlk'

  beforeEach(async () => {
    await dbc.truncateTable(dbc.User)
  })

  describe('getOrAdd()', () => {
    it('should add user if not exists', async () => {
      const userApplication = new UserApplication(userId)
      const productId = 123
      const user = await userApplication.getOrAdd(productId)

      expect(user).to.be.a.instanceof(UserEntity)
      expect(user.userId).to.be.equal(userId)
    })
  })

  describe('adminListAll()', () => {
    it('should get all users', async () => {
      const user1 = await UserEntityPersistMock(dbc)
      const user2 = await UserEntityPersistMock(dbc)
      const user3 = await UserEntityPersistMock(dbc)

      const userApplication = new UserApplication(userId)
      const users = await userApplication.adminListAll()

      const sortedFoundUsers = users.sort((a, b) => (a.userId >= b.userId) ? 1 : 0)
      const sortedCreatedUsers = [user1, user2, user3].sort((a, b) => (a.userId >= b.userId) ? 1 : 0)

      expect(sortedFoundUsers).to.be.deep.equal(sortedCreatedUsers)
    })
  })

  after(() => {
    dbc.close()
  })
})