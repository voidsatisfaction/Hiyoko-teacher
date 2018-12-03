export enum TableNames {
  HiyokoActionLogs = 'HiyokoActionLogs'
}

export type IHiyokoActionLoggerParam = {
  userId: string
  productId: number
  action: string
  content: object
  createdAt: string
}

export interface ILoggerDBClient {
  putItem(
    tableName: TableNames,
    userId: string,
    productId: number,
    action: string,
    createdAt: string,
    content?: object,
  ): Promise<object>
}