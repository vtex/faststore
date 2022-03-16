/* eslint-disable no-console */
import app from './server'

const port = process.env.PORT ?? '4000'

app.listen(port)

console.log(`🚀 Server ready at http://localhost:${port}/graphql.`)
