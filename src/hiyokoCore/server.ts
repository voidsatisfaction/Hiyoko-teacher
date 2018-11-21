import * as express from 'express'
import * as morgan from 'morgan'

import UserRouter from './web/User'

const app = express()

// common middleware
app.use(express.json())

// environment middleware
switch (process.env.NODE_ENV) {
  case 'PROD':
    app.use(morgan('combined'))
    break
  case 'DEV':
    app.use(morgan('dev'))
    break
  case 'TEST':
    app.use(morgan('dev'))
    break
  default:
    throw `NODE_ENV is not set properly`
}

// custom router
app.use('/users', UserRouter)

app.get('/', (req, res) => {
  res.send('worked')
});

const port = process.env.PORT || 3000

app.listen(port, () =>
  console.log(`Server running on ${port}!, ENV: ${process.env.NODE_ENV}, `)
);

export default app