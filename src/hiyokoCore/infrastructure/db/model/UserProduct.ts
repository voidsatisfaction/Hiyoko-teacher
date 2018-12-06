import Sequelize from 'sequelize'

import { SequelizeModelBase } from './Base';

export class SequelizeUserProductTable extends SequelizeModelBase {
  static readonly tableName = 'User_products'
  static readonly model = {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    productId: {
      type: Sequelize.TINYINT.UNSIGNED
    }
  }
  static readonly options = {
    createdAt: false,
    updatedAt: false
  }
}