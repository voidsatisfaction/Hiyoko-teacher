import Sequelize from 'sequelize'
import { Configure } from '../../../../../config'
import { IDbClient } from '../../../interface/infrastructure/db'

import { SequelizeUserTable } from '../model/User'
import { SequelizeVocabularyTable } from '../model/Vocabulary'
import { SequelizeVocabularyListTable } from '../model/VocabularyList'

interface ITableInstance {
  destroy(option: object)
}

export class DbClientComponent {
  dbClient(): IDbClient {
    return new DbClient()
  }
}

export class DbClient implements IDbClient {
  readonly User
  readonly Vocabulary
  readonly VocabularyList
  readonly Op
  readonly QueryTypes
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
        timezone: 'Asia/Tokyo',
      }
    )

    this.User = this.hiyokoCoreDB.define(
      SequelizeUserTable.tableName,
      SequelizeUserTable.model,
      SequelizeUserTable.options
    )
    this.Vocabulary = this.hiyokoCoreDB.define(
      SequelizeVocabularyTable.tableName,
      SequelizeVocabularyTable.model,
      SequelizeVocabularyTable.options
    )
    this.VocabularyList = this.hiyokoCoreDB.define(
      SequelizeVocabularyListTable.tableName,
      SequelizeVocabularyListTable.model,
      SequelizeVocabularyListTable.options
    )

    this.Op = Sequelize.Op

    this.QueryTypes = this.hiyokoCoreDB.QueryTypes
  }

  async query(sql: string, placeholders: object, ) {
    return await this.hiyokoCoreDB.query(sql, placeholders)
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
