import * as express from 'express'
import * as morgan from 'morgan'

import UserRouter from './web/UserWeb'
import VocabularyListRouter from './web/VocabularyListWeb'
import AdminRouter from './web/AdminWeb'

const app = express()

// common middleware
app.use(express.json())

// environment dependent middleware
switch (process.env.NODE_ENV) {
  case 'PROD':
    app.use(morgan('combined'))
    break
  case 'DEV':
    app.use(morgan('dev'))
    break
  case 'TEST':
    break
  default:
    throw `NODE_ENV is not set properly`
}

// normal router
app.use('/users', UserRouter)
app.use('/vocabularyLists', VocabularyListRouter)
app.get('/', (req, res) => {
  res.send(`worked ${process.env.NODE_ENV}`)
})
// admin router
app.use('/admin', AdminRouter)

// error
app.use('*', (req, res) => {
  res.status(404).json('not found')
})

const port = process.env.PORT || 3000

app.listen(port, () =>
  console.log(`Server running on ${port}!, ENV: ${process.env.NODE_ENV}, `)
);

export default app