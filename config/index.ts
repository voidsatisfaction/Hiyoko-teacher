export class Configure {
  readonly dbName: string
  readonly dbUserName: string
  readonly dbPassword: string
  readonly dbHost: string
  readonly dbPort: number
  readonly lineBotAccessToken: string
  readonly lineBotSecretToken: string

  constructor() {
    switch (process.env.NODE_ENV) {
      case 'PROD':
        
        break;
      case 'DEV':
        this.dbName = 'Hiyoko_core'
        this.dbUserName = 'root'
        this.dbPassword = ''
        this.dbHost = 'localhost'
        this.dbPort = 13306

        this.lineBotAccessToken = process.env.LINE_BOT_ACCESS_TOKEN
        this.lineBotSecretToken = process.env.LINE_BOT_SECRET_TOKEN
        break
      case 'TEST':
        this.dbName = 'Hiyoko_core'
        this.dbUserName = 'root'
        this.dbPassword = ''
        this.dbHost = 'localhost'
        this.dbPort = 13306

        this.lineBotAccessToken = process.env.LINE_BOT_ACCESS_TOKEN
        this.lineBotSecretToken = process.env.LINE_BOT_SECRET_TOKEN
        break
      default:
        throw `NODE_ENV environment variable is not valid value NODE_ENV: ${process.env.NODE_ENV}`
    }
  }
}

