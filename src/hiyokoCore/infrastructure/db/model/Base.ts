export abstract class SequelizeModelBase {
  static readonly tableName: string
  static readonly model: object
  static readonly options?: object
}