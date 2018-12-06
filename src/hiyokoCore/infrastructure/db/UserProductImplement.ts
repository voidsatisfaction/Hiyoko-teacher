import { IUserProductRepository, IUserProductAction, IUserProductLoader } from "../../domain/repository/UserProductRepository";
import { IDbClient } from "../../interface/infrastructure/db";
import { UserProductEntity } from "../../domain/model/User";
import { RepositoryBase } from "./RepositoryBase";

export class UserProductRepositoryImplement {
  dbc: IDbClient

  userProductRepository(): IUserProductRepository {
    return ({
      userProductLoader: () => new UserProductDB(this.dbc),
      userProductAction: () => new UserProductDB(this.dbc)
    })
  }
}

class UserProductDB extends RepositoryBase<UserProductEntity> implements
  IUserProductAction,
  IUserProductLoader {

  readonly dbc: IDbClient
  readonly tableName: string

  constructor(dbc: IDbClient) {
    super()
    this.dbc = dbc
    this.tableName = 'User_products'
  }

  protected parseAs(
    data: any[],
    UserProductEntityClass: { new(...args: any[]): UserProductEntity }
  ): UserProductEntity[] {
    return data.map(d => new UserProductEntityClass(d.userId, d.productId))
  }

  async create(userId: string, productId: number): Promise<UserProductEntity> {
    await this.dbc.query(`
      INSERT INTO ${this.tableName}
        (userId, productId)
      VALUES
        (:userId, :productId)
      ON DUPLICATE KEY UPDATE
        productId = VALUES(productId)
    `, {
      replacements: {
        userId,
        productId
      },
      type: this.dbc.QueryTypes.INSERT
    })

    return new UserProductEntity(userId, productId)
  }

  async findByUserId(userId: string): Promise<UserProductEntity> {
    const rows = await this.dbc.query(`
      SELECT * FROM ${this.tableName}
        WHERE userId = :userId
        LIMIT 1
    `, {
      replacements: {
        userId
      },
      type: this.dbc.QueryTypes.SELECT
    })

    return this.parseAs(rows, UserProductEntity)[0]
  }
}