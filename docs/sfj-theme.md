# SFJ Store Theme

The [SFJ Store Theme](https://github.com/vtex/faststore/tree/master/packages/gatsby-theme-store) is a [Gatsby theme](https://www.gatsbyjs.com/docs/themes/what-are-gatsby-themes/#gatsby-themes), a specific plugin type that contains pre-configured functionalities, data sourcing, and UI code defined in a [`/src/gatsby-config.js`](https://github.com/vtex/faststore/blob/master/packages/gatsby-theme-store/src/gatsby-config.ts) file.

Different from a plugin, in a Gatsby theme, default configurations (shared functionality, data sourcing, UI code) are abstracted into an installable package.

This way, Gatsby themes make it possible to control site styling through decoupled packages, characterized for version control and autonomous updates.

For being packaged as a standalone product, it is also possible to have more than one theme on the same site.

The SFJ Store Theme incorporates VTEX ecommerce solutions by configuring the following plugins:

- [`@vtex/gatsby-plugin-theme-ui`](https://github.com/vtex/faststore/tree/master/packages/gatsby-plugin-theme-ui) - Allows theme styling and optimizes the way CSS is merged. Leveraging from the [Theme UI](https://theme-ui.com/), this plugin incorporates the [Store UI library](https://github.com/vtex/faststore/tree/master/packages/store-ui) - a library that contains storefront components, such as the [Minicart](https://github.com/vtex/faststore/tree/master/packages/store-ui/src/Minicart).
- [`@vtex/gatsby-plugin-i18n`](https://github.com/vtex/faststore/tree/master/packages/gatsby-plugin-i18n) - Allows store internationalization.
- [`@vtex/gatsby-plugin-graphql`](https://github.com/vtex/faststore/tree/master/packages/gatsby-plugin-graphql) - Builds and preprocesses VTEX store's GraphQL queries.
