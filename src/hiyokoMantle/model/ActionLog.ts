export interface ActionLog {
  userId: string
  action: string
  createdAt: string
  productId?: number
  content?: object
}