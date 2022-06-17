<p align="center">
  <a href="https://faststore.dev">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  FastStore API
</h1>
<p align="center">
  <strong>
    Connect to your favorite ecommerce platform
  </strong>
</p>

<div style="display: flex; justify-content: center; width: 100%">
  <a href="https://www.npmjs.com/package/@faststore/api" style="padding: 0px 2px 0px 0px">
    <img src="https://badge.fury.io/js/%40faststore%2Fui.svg" />
  </a>
  <a href="https://bundlephobia.com/package/@faststore/api" style="padding: 0px 0px 0px 2px">
    <img src="https://badgen.net/bundlephobia/dependency-count/@faststore/api" />
  </a>
</div>

## Installation

From the command line in your project directory, run yarn add `@faststore/api`.

```cmd
yarn add @faststore/api
```

## Usage

With servers like express:

```ts
import { execute } from 'graphql'
import { getSchema } from '@faststore/api'

import express from 'express'

const app = express()

app.get('/graphql', async (req, res) => {
  const { query, operationName, variables } = req.body

  const result = await execute({
    schema: await getSchema(),
    variableValues: variables,
    operationName,
  })

  res.status(200)
  res.send(result)
})
```

## Docs

For more information, please refer to our documentation: https://faststore.dev/reference/api/faststore-api
