import { UserEntity } from '../model/User'

export interface IUserRepository {
  userBootstrap: () => IUserBootstrap
  userLoader: () => IUserLoader
}

export interface IUserLoader {
  listAll(): Promise<UserEntity[]>
  findByUserId(userId: string): Promise<UserEntity | null>
}

export interface IUserBootstrap {
  findOrCreate(userId: string): Promise<UserEntity>
}