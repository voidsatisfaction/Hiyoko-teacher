export class Configure {
  readonly dbName: string
  readonly dbUserName: string
  readonly dbPassword: string
  readonly dbHost: string
  readonly dbPort: string
  readonly lineBotAccessToken: string
  readonly lineBotSecretToken: string
  readonly coreURL: string

  constructor() {
    switch (process.env.NODE_ENV) {
      case 'PROD':
        this.dbName = 'Hiyoko_core'
        this.dbUserName = process.env.DB_USER_NAME
        this.dbPassword = process.env.DB_PASSWORD
        this.dbHost = process.env.DB_HOST
        this.dbPort = process.env.DB_PORT
        this.coreURL = process.env.CORE_URL

        this.lineBotAccessToken = process.env.LINE_BOT_ACCESS_TOKEN
        this.lineBotSecretToken = process.env.LINE_BOT_SECRET_TOKEN
        break
      case 'DEV':
        // DEV(sh ./script/dev.sh)
        this.dbName = 'Hiyoko_core'
        this.dbUserName = 'root'
        this.dbPassword = ''
        this.dbHost = 'db'
        this.dbPort = '3306'

        this.coreURL = 'http://localhost:13000'

        this.lineBotAccessToken = process.env.LINE_BOT_ACCESS_TOKEN
        this.lineBotSecretToken = process.env.LINE_BOT_SECRET_TOKEN
        break
      case 'TEST':
        // TEST(CI / local unit test npm run test)
        this.dbName = 'Hiyoko_core'
        this.dbUserName = 'root'
        this.dbPassword = ''
        this.dbHost = 'localhost'
        this.dbPort = '13306'

        this.coreURL = 'http://localhost:13000'

        this.lineBotAccessToken = process.env.LINE_BOT_ACCESS_TOKEN
        this.lineBotSecretToken = process.env.LINE_BOT_SECRET_TOKEN
        break
      default:
        throw `NODE_ENV environment variable is not valid value NODE_ENV: ${process.env.NODE_ENV}`
    }
  }
}

