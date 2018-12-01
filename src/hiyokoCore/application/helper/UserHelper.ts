import { UserEntity } from "../../domain/model/User"
import { IUserBootstrap, IUserLoader } from "../../domain/repository/UserRepository"
import { applyMixins } from "../../../util/Mixin"
import { UserRepository } from "../../infrastructure/db/UserRepository"
import { IDbClient } from "../../interface/infrastructure/db";
import { UserHelperUnauthorizedError } from "../error";

export class UserHelperComponent
  implements UserRepository {

  userId: string
  dbc: IDbClient

  userBootstrap: () => null
  userLoader: () => IUserLoader

  async getCurrentUser(): Promise<UserEntity> {
    const userEntity = await this.userLoader().findByUserId(this.userId)
    if (!userEntity) {
      throw new UserHelperUnauthorizedError(`Unauthorized user action`)
    }
    return userEntity
  }
}

applyMixins(
  UserHelperComponent,
  [UserRepository]
)