const http = require('http')
const url = require('url')
const next = require('next')

// eslint-disable-next-line turbo/no-undeclared-env-vars
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const { config } = require('./.next/required-server-files.json')

// eslint-disable-next-line turbo/no-undeclared-env-vars
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config)

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true)
      handle(req, res, parsedUrl).then(() => {
        let startTime = Date.now()
        console.log({
          url: req.url,
          method: req.method,
          headers: req.headers,
          code: res.statusCode,
          startTime: startTime,
          endTime: Date.now(),
        })
      })
    })
    .listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
