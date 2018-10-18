import Sequelize from 'sequelize'

import { SequelizeModelBase } from './base';

export class SequelizeVocabularyTable extends SequelizeModelBase {
  static readonly tableName = 'Vocabularies'
  static readonly model = {
    vocaId: {
      type: Sequelize.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true
    },
  }

  static readonly options = {
    timestamps: false,
  }
}