export interface IDbClient {
  User: any
  Vocabulary: any
  VocabularyList: any

  close(): Promise<void>
}