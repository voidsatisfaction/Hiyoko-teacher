import { expect } from 'chai';

import { UserApplication } from '../../../src/hiyokoCore/application/UserApplication'
import { UserEntity } from '../../../src/hiyokoCore/domain/model/User';
import { DbClient } from '../../../src/hiyokoCore/infrastructure/db/client';

describe('User application test', () => {
  const dbc = new DbClient()
  const userId = '123sdfasdkfmlk'
  const userApplication = new UserApplication(userId)

  beforeEach(async () => {
    await dbc.truncateTable(dbc.User)
  })

  describe('getOrAdd()', () => {
    it('should add user if not exists', async () => {
      const user = await userApplication.getOrAdd()

      expect(user).to.be.a.instanceof(UserEntity)
      expect(user.userId).to.be.equal(userId)
    })
  })

  after(() => {
    dbc.close()
  })
})