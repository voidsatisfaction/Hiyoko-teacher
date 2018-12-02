import Sequelize from 'sequelize'

import { SequelizeModelBase } from './Base';

export class SequelizeVocabularyListTable extends SequelizeModelBase {
  static readonly tableName = 'Vocabulary_lists'
  static readonly model = {
    vocaListId: {
      type: Sequelize.BIGINT.UNSIGNED,
      primaryKey: true
    },
    userId: {
      type: Sequelize.STRING,
    },
    vocaId: {
      type: Sequelize.BIGINT.UNSIGNED,
    },
    meaning: {
      type: Sequelize.STRING,
    },
    contextSentence: {
      type: Sequelize.STRING,
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