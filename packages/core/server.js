const http = require('http')
const url = require('url')
const NextServer = require('next/dist/server/next-server').default
const { config } = require('./.next/required-server-files.json')
// const pinoLogger = require("pino");
const { parse } = require('url')

// eslint-disable-next-line turbo/no-undeclared-env-vars
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config)

// eslint-disable-next-line turbo/no-undeclared-env-vars
const port = parseInt(process.env.PORT || '3000', 10)
// eslint-disable-next-line turbo/no-undeclared-env-vars
const hostname = process.env.HOSTNAME || 'localhost'
const dev = process.env.NODE_ENV !== 'production'

const app = new NextServer({
  hostname: hostname,
  port,
  dir: process.cwd(),
  dev,
  conf: config,
})

const handle = app.getRequestHandler()

const getLogger = () => {
  return pinoLogger({
    level: 'debug', // TODO: define by env
  })
}
let logger = getLogger()

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      let startTime = Date.now()
      const parsedUrl = parse(req.url, true)
      handle(req, res, parsedUrl).then(() => {
        logger.info({
          url: req.url,
          method: req.method,
          headers: req.headers,
          code: res.statusCode,
          startTime: startTime,
          endTime: Date.now(),
        })
      })
    })
    .listen(port, () => {
      console.log(
        `> [CUSTOM] Server listening at http://${hostname}:${port} as ${
          dev ? 'development' : process.env.NODE_ENV
        }`
      )
    })
})
