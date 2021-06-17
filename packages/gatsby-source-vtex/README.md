# gatsby-source-vtex

Source plugin for creating your next store powered by VTEX.

## Install
```
yarn add @vtex/gatsby-source-vtex
```

# How to use
```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    // other plugins ...
    {
      resolve: '@vtex/gatsby-source-vtex',
      options: {
        maxNumPaths: 5000, // Max number of static paths to source
        tenant: STORE_ID, // VTEX account name
        environment: 'vtexcommercestable', // VTEX env
        workspace: 'master', // VTEX IO workspace
      }
    },
  ],
}
```

## How to contribute
Feel free to open issues in our repo. Also, there is a general contributing guideline in there
