import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { getLogger } from './src/utils/logger'

const port = 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let logger = getLogger()

app.prepare().then(() => {
  createServer((req, res) => {
    let startTime = Date.now()
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl).then(() =>
      logger.info({
        url: req.url,
        method: req.method,
        headers: req.headers,
        code: res.statusCode,
        startTime: startTime,
        endTime: Date.now(),
      })
    )
  }).listen(port)

  logger.info(
    `> [CUSTOM SERVER] FastStore server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
