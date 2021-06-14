# Choosing Which Pages are Pre-Rendered

One of the core principles of [JAMStack](https://github.com/vtex/faststore/tree/master/docs/what-is-jamstack.md) is the pre-rendering, or static generation, of pages at build time. This provides artifacts of highly optimized static pages, reducing the runtime complexity while increasing performance and resiliency. In the end we're left with a super stable & faststore...

## Using the `@vtex/gatsby-vtex-source` Plugin

>ℹ️ *We are assuming you have followed the [Getting Started](https://github.com/vtex/faststore/tree/master/docs/getting-started.md) document and have a running store.*

`gatsby-vtex-source` comes with a default function that employs sensible defaults in building the list of static paths. After some initialization beyond the scope of this document, `gatsby-vtex-source` checks the `typeof` the `getStaticPaths` Plugin Option. If it is a `function`, the option is used. Otherwise the default configuration will be run.

### Base Configuration

First, the site's project root is checked for a file, `staticPaths.json`. The contents of which are the seed value for the `paths` array we will be building cumulatively.

>ℹ️ **Note:** *`staticPaths.json` should be an array of strings. i.e.* `["/apparel---accessories", "/apparel---accessories/hats" ]`

>:exclamation: **Notice:** *When running in Development mode this process stops here!*

Next we fetch a Catalog Category Tree up to 4 levels deep and recursively walk the results adding to the `paths` array.

After Categories we fetch a list of up to 1000 Brands, looping and adding a built path to the `paths` array.

>:exclamation: **Notice:** *The default `maxNumPaths` is 100. This setting only comes into effect below.*

Now we will begin paging through the Catalog Products, up to a max of 2500 results, and ordered by **Top Sales**. The results will be added to the `paths` array until it is `maxNumPaths` in size.

---
### Extending the Base Configuration

The simple method of extending the base behavior of the static paths function is to define a `staticPaths.json` in your Project Root as an array of strings. The values should be the [Path to the Resource](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL#path_to_resource).

---
### Overriding the Base Configuration

If you want to take full control of the logic for deciding what resources are pre-rendered, you can do so by using the `getStaticPaths` Plugin Option adhering to the signature `() => Promise<string[]>`.
**Best Practice** is to define a file, `getStaticPaths.js`, in the Project Root. This file should export a single async function and ultimately return an array of strings, or URL Paths if we want to be specific. The contents of this function are up to you but the [default function](https://github.com/vtex/faststore/blob/master/packages/gatsby-source-vtex/src/staticPaths.ts#L38) can be used as a blueprint for your customizations.
This file would then be utilized in your projects `gatsby-config.js` and required so it can be used in the plugin configuration.
```javascript
# where getStaticPaths.js exports a single function
# that returns an array of strings. Note that no options
# are sent to the getStaticPaths function when used over
# the default static paths function.
const getStaticPaths = require('./getStaticPaths')
module.exports = {
  plugins: [
    {
      resolve: `@vtex/gatsby-source-vtex`,
      options: {
        tenant: account,
        environment,
        workspace,
        filesNewPath: true,
        ignorePaths: ['/bin'],
        getStaticPaths,
        getRedirects: () => {}
      },
    },
  ]
} 
```
---
### Plugin Options
| Name           | Type     | Required? | Default                                                                                                            | Comments                                                                                            |
| -------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| tenant         | string   | true      | n/a                                                                                                                |                                                                                                     |
| workspace      | string   | true      | n/a                                                                                                                |                                                                                                     |
| environment    | pattern  | true      | n/a                                                                                                                | `(vtexcommercestable\|vtexcommercebeta)`                                                            |
| getStaticPaths | function | false     | [staticPaths.ts](https://github.com/vtex/faststore/blob/master/packages/gatsby-source-vtex/src/staticPaths.ts#L38) | *Primary Subject of this Document*                                                                  |
| getRedirects   | function | false     | n/a                                                                                                                | See [Managing URL Redirects](https://github.com/vtex/faststore/tree/master/docs/getting-started.mb) |
| pageTypes      | string[] | false     | `['Product', 'Department', 'Category', 'Brand', 'SubCategory',]`                                                   |                                                                                                     |
| maxNumPaths    | number   | false     | 100                                                                                                                |                                                                                                     |
| ignorePaths    | string[] | false     | n/a                                                                                                                | *Can be used to exclude paths from the final results returned by `getStaticPaths`                   |

---
## Considerations

:exclamation: It is important to keep in mind that the larger this array of Paths, the longer the final build will be and while we work towards solutions to remove these restraints, it is important to be aware of and maintain a balance between realizing performance improvements at runtime coupled with increased time needed at build time.
