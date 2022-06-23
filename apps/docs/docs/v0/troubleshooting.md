# Troubleshooting: VTEX Integration

Throughout the integration of your FastStore project with the VTEX platform, you may come across common errors that have already tricked other FastStore users. This article is intended to help you troubleshoot some of these issues.

:::caution
This article is intended for those who started their FastStore project with the Store Components starter.
:::

## Redirect loop on MyAccount Page

If shoppers are experiencing an infinite loop on their MyAccount pages, first check if the version of the `@vtex/gatsby-plugin-nginx` plugin specified in your project's `package.json` file is equal or greater than `0.373.49`.

If so, find and replace **all mentions** to the `/account/` path in your project with `/io/account/`. Make sure to review the `gatsby-node.js` and `src/pages/account.tsx` files, as well as any other component of your storefront that redirects users to the `/account/` path.

Take the following example:

```diff title="gatsby-node.js" {2,3}
   createRedirect({
--    fromPath: '/account/*',
++    fromPath: '/io/account/*',
     toPath: `https://${GATSBY_STORE_ID}.${GATSBY_VTEX_ENVIRONMENT}.com.br/api/io/account/:splat?workspace=${GATSBY_VTEX_IO_WORKSPACE}`,
     statusCode: 301,
     proxyHeaders: headers,
   })
```

After these adjustments, users will be correctly redirected to their MyAccount pages.
