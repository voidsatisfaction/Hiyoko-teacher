export interface IUserRepository {
  findAll(): Promise<UserEntity[]>
}