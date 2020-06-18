require("dotenv").config({
  path: `crystallize-config`,
})

module.exports = {
  siteMetadata: {
    title: `Crystallize`,
    description: `Headless ecommerce running on Crystallize and Gatsby`,
    author: `@crystallizeapi`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-plugin-module-resolver",
      options: {
        root: "./src", // <- will be used as a root dir
        aliases: {
          components: "./components", // <- will become ./src/components
          ui: "./ui", // <- will become ./src/components
          utils: "./utils", // <- will become ./src/components
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Crystallize`,
        short_name: `Crystallize`,
        start_url: `/`,
        icon: `src/images/crystallize-icon.png`,
        background_color: `#f3f4f6`,
        theme_color: `#B7E2E4`,
        display: `minimal-ui`,
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        // This type will contain remote schema Query type
        typeName: "CRYSTALLIZE",
        // This is the field under which it's accessible
        fieldName: "crystallize",
        // URL to query from
        url: `${process.env.CRYSTALLIZE_API_BASE}/${process.env.CRYSTALLIZE_TENANT_ID}/catalogue`,
      },
    },
    "gatsby-plugin-styled-components",
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
