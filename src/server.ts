import * as express from 'express'
import * as env from 'env-var'
import * as morgan from 'morgan'
import { getDatabaseDetails, getCollection } from './db'

const app = express()

const MORGAN_ENABLED = env.get('MORGAN_ENABLED', 'true').asBool()

app.engine('html', require('ejs').renderFile)
app.use(morgan('combined', {
  skip: (req, res) => {
    return !MORGAN_ENABLED
  }
}))

app.get('/', async (req: express.Request, res: express.Response) => {
  const col = await getCollection('counts')

  if (col) {
    await col.insert({ip: req.ip, date: Date.now()})

    const count = await col.count({})

    res.render('index.html', { pageCountMessage : count, dbInfo: getDatabaseDetails() })
  } else {
    res.render('index.html', { pageCountMessage : null})
  }
})

app.get('/pagecount', async (req, res) => {
  const col = await getCollection('counts')

  if (col) {
    const count = await col.count({})

    res.json({ pageCount: count })
  } else {
    res.json({ pageCount: -1 })
  }
})

export function getServer () {
  return app
}
