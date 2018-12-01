import { UserEntity } from "../../domain/model/User"
import { IUserBootstrap, IUserLoader } from "../../domain/repository/UserRepository"
import { applyMixins } from "../../../util/Mixin"
import { UserRepository } from "../../infrastructure/db/UserRepository"
import { IDbClient } from "../../interface/infrastructure/db";

export class UserHelperComponent
  implements UserRepository {

  userId: string
  dbc: IDbClient

  userBootstrap: () => null
  userLoader: () => IUserLoader

  async getCurrentUser(): Promise<UserEntity> {
    return await this.userLoader().findByUserId(this.userId)
  }
}

applyMixins(
  UserHelperComponent,
  [UserRepository]
)