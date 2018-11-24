import { UserEntity } from "../../domain/model/User"
import { IUserBootstrap, IUserLoader } from "../../domain/repository/User"
import { IDbClient } from "../../infrastructure/db/client"
import { applyMixins } from "../../../util/Mixin";
import { UserRepository } from "../../infrastructure/db/UserRepository";

export class UserHelperComponent
  implements UserRepository {

  dbc: IDbClient

  userBootstrap: () => IUserBootstrap
  userLoader: () => IUserLoader

  async getCurrentUser(userId: string): Promise<UserEntity> {
    return await this.userBootstrap().findOrCreate(userId)
  }
}

applyMixins(
  UserHelperComponent,
  [UserRepository]
)