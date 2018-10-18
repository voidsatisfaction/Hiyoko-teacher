import Sequelize from 'sequelize'

import { SequelizeModelBase } from './base';

export class SequelizeVocabularyListTable extends SequelizeModelBase {
  static readonly tableName = 'Vocabulary_lists'
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
    updatedAt: false,
    indexes: [
      { fields: ['userId', 'createdAt'] },
      { fields: ['userId'] },
      { fields: ['vocaId'] },
      { fields: ['created_at'] },
    ]
  }
}