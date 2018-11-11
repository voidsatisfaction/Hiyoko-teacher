import * as express from 'express'

import UserRouter from './web/User'

const app = express()

app.use('/user', UserRouter)

app.get('/', (req, res) => {
  res.send('worked')
});

const port = process.env.PORT || 3000

app.listen(port, () =>
  console.log(`Server running on ${port}!`)
);