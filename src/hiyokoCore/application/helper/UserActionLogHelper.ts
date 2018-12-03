import { ILoggerDBClient, TableNames } from "../../interface/infrastructure/LoggerDB"

export enum Action {
  follow                = 'follow',
  addVocabularyList     = 'add-vocabulary-list',
  deleteVocabularyList  = 'delete-vocabulary-list',
  readVocabularyLists   = 'read-vocabulary-lists'
}

export interface IUserActionLoggerObject {
  putActionLog(
    action: Action,
    productId: number,
    content?: object,
  ): Promise<void>
}

export class UserActionLogHelperComponent {
  userId: string
  loggerDBC: ILoggerDBClient

  userActionLogger() {
    return ({
      putActionLog: async (
        action: Action,
        productId: number,
        content?: object,
      ): Promise<void> => {
        try {
          const createdAt = new Date().toISOString()

          await this.loggerDBC.putItem(
            TableNames.HiyokoActionLogs,
            this.userId,
            productId,
            action,
            createdAt,
            content,
          )
        } catch (e) {
          // TODO: send slack error message
          console.error(e)
        }
      }
    })
  }
}