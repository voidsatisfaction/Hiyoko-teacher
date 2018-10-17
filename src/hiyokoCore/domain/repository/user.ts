import { UserEntity } from '../model/user'

export interface IUserRepository {
  findOrCreate(userId: string): Promise<UserEntity>
  findByUserId(userId: string): Promise<UserEntity | null>
  listAll(): Promise<UserEntity[]>
}