import { UserEntity } from '../model/User'

export interface IUserRepository {
  dbc: any
  userBootstrap: () => IUserBootstrap
  userLoader: () => IUserLoader
}

export interface IUserLoader {
  dbc: any
  listAll(): Promise<UserEntity[]>
  findByUserId(userId: string): Promise<UserEntity | null>
}

export interface IUserBootstrap {
  dbc: any
  findOrCreate(userId: string): Promise<UserEntity>
}