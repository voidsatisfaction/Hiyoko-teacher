export class Configure {
  readonly nodeEnv: string
  readonly awsAccessKeyId: string
  readonly awsSecretAccessKey: string
  readonly dbName: string
  readonly dbUserName: string
  readonly dbPassword: string
  readonly dbHost: string
  readonly dbPort: string
  readonly lineBotAccessToken: string
  readonly lineBotSecretToken: string
  readonly coreURL: string
  readonly adminToken: string

  constructor() {
    switch (process.env.NODE_ENV) {
      case 'PROD':
        this.nodeEnv = 'PROD'

        this.awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
        this.awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
        this.dbName = 'Hiyoko_core'
        this.dbUserName = process.env.DB_USER_NAME
        this.dbPassword = process.env.DB_PASSWORD
        this.dbHost = process.env.DB_HOST
        this.dbPort = process.env.DB_PORT

        this.coreURL = process.env.CORE_URL

        this.lineBotAccessToken = process.env.LINE_BOT_ACCESS_TOKEN
        this.lineBotSecretToken = process.env.LINE_BOT_SECRET_TOKEN

        this.adminToken = process.env.ADMIN_TOKEN
        break
      case 'DEV':
        // DEV(sh ./script/dev.sh)
        this.nodeEnv = 'DEV'

        this.awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
        this.awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
        this.dbName = 'Hiyoko_core'
        this.dbUserName = 'root'
        this.dbPassword = ''
        this.dbHost = 'db'
        this.dbPort = '3306'

        this.coreURL = process.env.CORE_URL

        this.lineBotAccessToken = process.env.LINE_BOT_ACCESS_TOKEN
        this.lineBotSecretToken = process.env.LINE_BOT_SECRET_TOKEN

        this.adminToken = process.env.ADMIN_TOKEN
        break
      case 'TEST':
        // TEST(CI / local unit test npm run test)
        this.nodeEnv = 'TEST'

        this.awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
        this.awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

        this.dbName = 'Hiyoko_core'
        this.dbUserName = 'root'
        this.dbPassword = ''
        this.dbHost = 'localhost'
        this.dbPort = '13306'

        this.coreURL = 'http://localhost:13000'

        this.lineBotAccessToken = process.env.LINE_BOT_ACCESS_TOKEN
        this.lineBotSecretToken = process.env.LINE_BOT_SECRET_TOKEN

        this.adminToken = '123'
        break
      default:
        throw `NODE_ENV environment variable is not valid value NODE_ENV: ${process.env.NODE_ENV}`
    }
  }
}

