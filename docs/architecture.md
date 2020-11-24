# Packages

All packages follow Gatsby's [plugin naming scheme](https://www.gatsbyjs.com/docs/plugins-themes-and-starters/). 

* **@vtex/gatsby-plugin-graphql** adds Webpack and Babel configuration so we can share queries and types between Gatsby and any other GraphQL server. This plugin is essential for dynamic, client-side queries.

* **@vtex/gatsby-plugin-i18n** is an optimized react-intl capable plugin. This plugin pre-optimizes messages we can serve react-intl without an ICU parser to the browser. Also, this plugin adds all necessary providers to the React tree

* **@vtex/gatsby-plugin-theme-ui** is an optimized theme-ui plugin for Gatsby. It includes many optimizations, not only on `theme-ui` but also on `emotion`. The goal is to merge this package into their community-based versions so all the community benefits from such optimizations.

* **@vtex/gatsby-plugin-nginx** allows you to serve your Gatsby site using `nginx`. This plugin creates a Netlify like experience where all dynamic pages, redirects, and reverse proxies are merged automatically into an `nginx.conf` file. Just pick this file and start serving your site from anywhere.

* **@vtex/gatsby-source-vtex** connects the Gatsby data layer to VTEX's GraphQL.

* **@vtex/gatsby-theme-store** contains a Web SDK and is the main skeleton of an ecommerce. In it, you will find the web's best practices, like above/below the fold techniques and first-class Pixel integration. Note that this repo should NOT contain any nonstructural component.

* **@vtex/gatsby-plugin-checkout** implements checkout's Web SDK. It can be used without `gatsby-theme-store` to create extremely custom experiences.

* **@vtex/gatsby-plugin-cms** integrates VTEX CMS with Gatsby. Live preview and pilot your ecommerce directly from VTEX Admin. Note that this overwrites any page in your gatsby project.

* **@vtex/lighthouse-config** contains an ecommerce focused Lighthouse CI configuration.

* **@vtex/store-ui** contains many building blocks for creating your store. All components follows [this pattern](/docs/component.md). Use it's storybook to find the right component for your ecommerce experience.
