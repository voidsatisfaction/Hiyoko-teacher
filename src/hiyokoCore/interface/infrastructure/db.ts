export interface IDbClient {
  query: any
  User: any
  Vocabulary: any
  VocabularyList: any
  Op: any
  QueryTypes: any

  close(): Promise<void>
}