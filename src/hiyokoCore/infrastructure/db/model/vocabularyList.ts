import Sequelize from 'sequelize'

import { SequelizeModelBase } from './base';

export class SequelizeVocabularyListTable extends SequelizeModelBase {
  static readonly tableName = 'VocabularyLists'
  static readonly model = {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    vocaId: {
      type: Sequelize.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    meaning: {
      type: Sequelize.STRING,
    },
    contextSentence: {
      type: Sequelize.STRING,
      unique: true
    },
    contextPictureURL: {
      type: Sequelize.STRING,
    },
  }
  static readonly options = {
    indexes: [
      { fields: ['userId', 'createdAt'] },
      { fields: ['userId'] },
      { fields: ['vocaId'] },
      { fields: ['created_at'] },
    ]
  }
}