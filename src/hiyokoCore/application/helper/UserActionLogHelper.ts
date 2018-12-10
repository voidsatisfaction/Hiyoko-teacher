import { ILoggerDBClient, TableNames, IHiyokoActionLoggerParam } from "../../interface/infrastructure/LoggerDB"
import { PromiseSleep } from "../../../util/PromiseSleep"

export enum Action {
  follow                = 'follow',
  addVocabularyList     = 'add-vocabulary-list',
  deleteVocabularyList  = 'delete-vocabulary-list',
  readVocabularyLists   = 'read-vocabulary-lists',

  getSimpleQuizzes      = 'get-simple-quizzes',
  getCompositeQuizzes   = 'get-composite-quizzes',
  solveSimpleQuizzes    = 'solve-simple-quizzes',
  solveCompositeQuizzes = 'solve-composite-quizzes',
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
          let createdAt = new Date()

          // check before put item
          // dynamo db overwrite data with same primary key
          const actionLog = await this.loggerDBC.getItem<IHiyokoActionLoggerParam>(
            TableNames.HiyokoActionLogs,
            this.userId,
            createdAt.toLocaleString()
          )

          if (actionLog) {
            // promise sleep one second
            await PromiseSleep(1)
          }
          createdAt = new Date()

          await this.loggerDBC.putItem(
            TableNames.HiyokoActionLogs,
            this.userId,
            productId,
            action,
            createdAt.toLocaleString(),
            content,
          )
        } catch (e) {
          // TODO: send slack error message
          console.error(e)
          return null
        }
      }
    })
  }
}