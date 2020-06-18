require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: "Store Theme - VTEX Base Store",
    description: "Store created with gatsby for a POC using VTEX API",
    author: "Emerson Laurentino",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-theme-ui",
    {
      resolve: require.resolve("../gatsby-source-vtex"),
      options: {
        accountName: process.env.GATSBY_VTEX_ACCOUNT_NAME,
        environment: process.env.GATSBY_VTEX_ENVIRONMENT,
        appKey: process.env.GATSBY_VTEX_APP_KEY,
        appToken: process.env.GATSBY_VTEX_APP_TOKEN,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Store Theme - VTEX Base Store",
        short_name: "Store Theme",
        start_url: "/",
        background_color: "#0a034e",
        theme_color: "#0a034e",
        display: "minimal-ui",
      },
    },
  ],
}
