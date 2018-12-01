class UnauthorizedError extends Error {
  readonly statusCode: number
  constructor(message: string) {
    super(message)
    this.statusCode = 403
    this.name = 'Unauthorized: '
  }
}

export class VocabularyListApplicationUnauthorizationError extends UnauthorizedError {
  constructor(message: string) {
    super(message)
    this.name += message
  }
}