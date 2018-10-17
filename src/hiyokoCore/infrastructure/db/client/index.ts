import Sequelize from 'sequelize'
import { Configure } from '../../../../../config'

import { SequelizeUserTable } from '../model/user'

interface ITableInstance {
  destroy(option: object)
}

export class dbClient {
  readonly User
  private readonly hiyokoCoreDB

  constructor() {
    const c = new Configure();

    this.hiyokoCoreDB = new Sequelize(
      c.dbName,
      c.dbUserName,
      c.dbPassword,
      {
        host: c.dbHost,
        dialect: 'mysql',
        port: c.dbPort,
        logging: false,
      }
    )
    
    this.User = this.hiyokoCoreDB.define(
      SequelizeUserTable.tableName,
      SequelizeUserTable.model,
      SequelizeUserTable.options
    )
  }

  async close(): Promise<void> {
    return await this.hiyokoCoreDB.close()
  }

  async truncateTable(table: ITableInstance): Promise<any> {
    try {
      await this.unsetForeignKeyConstraint();
      await table.destroy({
        where: {},
        truncate: true,
      });
      return await this.setForeginKeyConstraint();
    } catch (error) {
      throw error;
    }
  }

  private unsetForeignKeyConstraint(): any {
    return this.hiyokoCoreDB.query('SET FOREIGN_KEY_CHECKS = 0', null, {});
  }

  private setForeginKeyConstraint(): any {
    return this.hiyokoCoreDB.query('SET FOREIGN_KEY_CHECKS = 1', null, {});
  }
}
