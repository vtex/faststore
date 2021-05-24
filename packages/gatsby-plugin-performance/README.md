# gatsby-plugin-performance

Optimizes assets and behaviors of the Gatsby framework for a notable increate in Google's lightouse score. 

Some optmizations included are:
- Reduce Gatsby's framework induced TBT. Apply [this PR](https://github.com/gatsbyjs/gatsby/pull/29636) 
- Reduce Gatsby's framework bundle sizes by using Server Routing (match-paths.json)

## Install

```
yarn add @vtex/gatsby-plugin-performance
```

## How to use 
```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    // other plugins ...
    `@vtex/gatsby-plugin-performance`    
  ],
}
```

## When do I use this plugin?

This plugin is usefull when you want that extra points on Google's Lighthouse and is hosting in a redirect capable server, like `Netlify` or the `@vtex/gatsby-plugin-nginx`

## How to contribute

Feel free to open issues in our repo. Also, there is a general contributing guidelines in there
