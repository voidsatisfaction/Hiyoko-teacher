import { ILoggerDBClient, TableNames, IHiyokoActionLoggerParam } from "../../interface/infrastructure/LoggerDB"
import { PromiseSleep } from "../../../util/PromiseSleep"
import { DateTime } from "../../../util/DateTime";

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
          let createdAt = new DateTime()

          // check before put item
          // dynamo db overwrite data with same primary key
          while (true) {
            createdAt = new DateTime()
            const actionLog = await this.loggerDBC.getItem<IHiyokoActionLoggerParam>(
              TableNames.HiyokoActionLogs,
              this.userId,
              createdAt.toDateTimeString()
            )

            if (actionLog) {
              // promise sleep one second
              await PromiseSleep(1)
            } else {
              break
            }
          }
          createdAt = new DateTime()

          await this.loggerDBC.putItem(
            TableNames.HiyokoActionLogs,
            this.userId,
            productId,
            action,
            createdAt.toDateTimeString(),
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