export class Configure {
  readonly dbName: string
  readonly dbUserName: string
  readonly dbPassword: string
  readonly dbHost: string
  readonly dbPort: number

  constructor() {
    switch (process.env.NODE_ENV) {
      case 'PROD':
        
        break;
      default:
        this.dbName = 'Hiyoko_core';
        this.dbUserName = 'root';
        this.dbPassword = '';
        this.dbHost = 'localhost';
        this.dbPort = 13306
        break;
    }
  }
}

