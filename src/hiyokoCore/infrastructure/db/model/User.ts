import Sequelize from 'sequelize'

import { SequelizeModelBase } from './Base';

export class SequelizeUserTable extends SequelizeModelBase {
  static readonly tableName = 'Users'
  static readonly model = {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
    }
  }
  static readonly options = {
    updatedAt: false
  }
}