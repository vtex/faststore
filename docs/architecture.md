# Packages

All packages follow Gatsby's [plugin naming scheme](https://www.gatsbyjs.com/docs/plugins-themes-and-starters/). 

* **gatsby-plugin-graphql** adds Webpack and Babel configuration so we can share queries and types between Gatsby and any other GraphQL server. This plugin is essential for dynamic, client side queries

* **gatsby-plugin-i18n** is an optimized react-intl capable plugin. This plugin pre-optimizes messages we can serve react-intl without an ICU parser to the browser. Also, this plugins adds all necessary providers to the React tree

* **gatsby-plugin-theme-ui** is an optimized theme-ui plugin for Gatsby. It includes many optmizations, not only on `theme-ui` but also on `emotion`. The goal is to merge this package into their community based versions so all the community benefits from such optimizations

* **gatsby-plugin-nginx** allows you to serve your Gatsby site using `nginx`. This plugin creates a Netlify like experience where all dynamic pages, redirects and reverse proxies are merged automatically into a `nginx.conf` file. Just pick this file and start serving your site from anywhere

* **gatsby-source-vtex** connects the Gatsby data layer to VTEX's GraphQL graph

* **gatsby-theme-store** contains a Web SDK and is the main skeleton of an ecommerce. In it you will find the web's best practices, like above/below the fold techniques an first class Pixel integration. Note that this repo should NOT contain any non structurant component

* **gatsby-plugin-checkout** implements checkout's Web SDK. It can be used without `gatsby-theme-store` to create extremelly custom experiences

* **gatsby-plugin-vtex-cms** integrates VTEX CMS with Gatsby. Live preview and pilot your ecommerce directly from VTEX Admin. Note that this overwrites any page in your gatsby project

* **lighthouse-config** contains an ecommerce focused Lighthouse CI configuration

* **store-ui** contains many building blocks for creating your store. All components follows [this pattern](/components.md). Use it's storybook to find the right component for your ecommerce experience
