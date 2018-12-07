import { expect } from 'chai'

import { DbClient } from '../../../../src/hiyokoCore/infrastructure/db/client'
import { UserRepositoryComponent } from '../../../../src/hiyokoCore/infrastructure/db/UserRepository'
import { UserEntity } from '../../../../src/hiyokoCore/domain/model/User'
import { IDbClient } from '../../../../src/hiyokoCore/interface/infrastructure/db'

class UserRepositoryTest extends UserRepositoryComponent {
  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
  }
}

describe('User repository test', () => {
  const dbc = new DbClient()
  const userRepository = new UserRepositoryTest(dbc)
  const userLoader = userRepository.userRepository().userLoader()
  const userBootstrap = userRepository.userRepository().userBootstrap()

  beforeEach(async () => {
    await dbc.truncateTable(dbc.User)
  })

  describe('findOrCreate()', () => {
    it('should find or create user', async () => {
      const userId = 'testtestid'
      const userId2 = 'testtestid2'
      const user1 = await userBootstrap.findOrCreate(userId)
      
      expect(user1).to.be.a.instanceof(UserEntity)
      expect(user1.userId).to.be.equal(userId)

      const user2 = await userBootstrap.findOrCreate(userId2)

      expect(user2).to.be.a.instanceof(UserEntity)
      expect(user2.userId).to.be.equal(userId2)

      const user3 = await userBootstrap.findOrCreate(userId2)

      expect(user3.userId).to.be.equal(user2.userId)
    })
  })

  describe('findByUserId()', () => {
    it('should return null when there is no user', async () => {
      const userId = 'nothing'

      const user = await userLoader.findByUserId(userId)

      expect(user).to.be.null
    })

    it('should return the found user', async () => {
      const userId = 'testtestid'
      const createdUser = await userBootstrap.findOrCreate(userId)

      const foundUser = await userLoader.findByUserId(userId)

      expect(createdUser.userId).to.be.equal(foundUser.userId)
    })
  })

  describe('listAll()', () => {
    it('should return all users', async () => {
      const userId1 = 'test1'
      const userId2 = 'test2'

      const user1 = await userBootstrap.findOrCreate(userId1)
      const user2 = await userBootstrap.findOrCreate(userId2)

      const users = await userLoader.listAll()

      expect(users).to.be.length(2)
      expect(users.map(u => u.userId)).to.deep.include(user1.userId)
      expect(users.map(u => u.userId)).to.deep.include(user2.userId)
    })
  })

  after(() => {
    dbc.close()
  })
})