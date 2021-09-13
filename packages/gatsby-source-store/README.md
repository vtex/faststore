# gatsby-source-store

Plugin for sourcing the store-api data layer into Gatsby.

## Install
```
yarn add @vtex/gatsby-source-vtex @vtex/store-api
```

# How to use
```js
// In your gatsby-config.js
const { getSchema } = require('@vtex/store-api')

const options = {
  platform: 'vtex',
  account: 'my-vtex-account',
  environment: 'vtexcommercestable'
}

module.exports = {
  plugins: [
    // other plugins ...
    {
      resolve: '@vtex/gatsby-source-store',
      options: {
        getSchema: () => getSchema(options)
      }
    },
  ],
}
```

# Options
This plugin brings additional options for you to control how the nodes are sourced.
|      Options      |   type  |                effect               |
|:-----------------:|:-------:|:-----------------------------------:|
| sourceProducts    | boolean |   false for not sourcing products   |
| sourceCollections | boolean |  false for not sourcing collections |
| maxNumProducts    |  number |   max number of products to source  |
| maxNumCollections |  number | max number of collections to source |

> Tip: While sourcing large ecommerces, add the maxNumProducts and maxNumCollections so you can develop without waiting for the whole dataset to be downloaded. Maybe try something like:
```js
const { getSchema } = require('@vtex/store-api')

const options = {
  platform: 'vtex',
  account: 'my-vtex-account',
  environment: 'vtexcommercestable'
}

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  plugins: [
    // other plugins ...
    {
      resolve: '@vtex/gatsby-source-store',
      options: {
        getSchema: () => getSchema(options)
        // Source less products is development for better DX
        maxNumProducts: isProduction ? undefined : 100,
        maxNumCollections: isProduction ? undefined : 100,
      }
    },
  ],
}
```

## How to contribute
Feel free to open issues in our repo. Also, there is a general contributing guideline in there
