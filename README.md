# Fast Store

https://docs.google.com/presentation/d/10SCY7ZO1WWGeUQs6VzJWAlp4r1404dVtIxx_YgYldZI/edit#slide=id.g8ef796eccd_0_336

https://miro.com/app/board/o9J_kobcu-Y=/
This is the home for the proof of concept project to create VTEX sites based on the Gatsby framework.

# How to develop
`graphql-js` package is cumbersome when using `yarn link` because it requires only one instance of the package and there are two.

To solve this problem you can deduplicate the instances by going into this project's `node_modules` and changing the file `node_modules/graphql/index.js` to

```js
module.exports = require('<path/to/the/tenant.store/node_modules/graphql/index.js>')
```
