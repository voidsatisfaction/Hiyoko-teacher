import { expect } from 'chai';

import { dbClient } from '../../../../src/hiyokoCore/infrastructure/db/Client';
import { UserRepository } from '../../../../src/hiyokoCore/infrastructure/db/UserRepository';
import { UserEntity } from '../../../../src/hiyokoCore/domain/model/User';

describe('User repository test', () => {
  const dbc = new dbClient()
  const userRepository = new UserRepository(dbc)

  beforeEach(async () => {
    await dbc.truncateTable(dbc.User)
  })

  describe('findOrCreate()', () => {
    it('should find or create user', async () => {
      const userId = 'testtestid'
      const userId2 = 'testtestid2'
      const user1 = await userRepository.findOrCreate(userId)
      
      expect(user1).to.be.a.instanceof(UserEntity)
      expect(user1.userId).to.be.equal(userId)

      const user2 = await userRepository.findOrCreate(userId2)

      expect(user2).to.be.a.instanceof(UserEntity)
      expect(user2.userId).to.be.equal(userId2)

      const user3 = await userRepository.findOrCreate(userId2)

      expect(user3.userId).to.be.equal(user2.userId)
    })
  })

  describe('findByUserId()', () => {
    it('should return null when there is no user', async () => {
      const userId = 'nothing'

      const user = await userRepository.findByUserId(userId)

      expect(user).to.be.null
    })

    it('should return the found user', async () => {
      const userId = 'testtestid'
      const createdUser = await userRepository.findOrCreate(userId)

      const foundUser = await userRepository.findByUserId(userId)

      expect(createdUser.userId).to.be.equal(foundUser.userId)
    })
  })

  describe('findAll()', () => {
    it('should return all users', async () => {
      const userId1 = 'test1'
      const userId2 = 'test2'

      const user1 = await userRepository.findOrCreate(userId1)
      const user2 = await userRepository.findOrCreate(userId2)

      const users = await userRepository.listAll()

      expect(users).to.be.length(2)
      expect(users.map(u => u.userId)).to.deep.include(user1.userId)
      expect(users.map(u => u.userId)).to.deep.include(user2.userId)
    })
  })

  after(() => {
    dbc.close()
  })
})