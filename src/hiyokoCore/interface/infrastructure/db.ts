export interface IDbClient {
  query: any
  User: any
  Vocabulary: any
  VocabularyList: any
  Op: any
  QueryTypes: any

  readonly UsersTableName: string
  readonly UsersProductsTableName: string
  readonly VocabulariesTableName: string
  readonly VocabularyListsTableName: string
  readonly CountSummaryTableName: string

  close(): Promise<void>
  truncateTable(tableName: any): Promise<void>
  truncateTableRaw(tableName: string): Promise<void>
  transaction(callback): Promise<any>
}