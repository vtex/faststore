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
        accountName: "storecomponents",
        environment: "vtexcommercestable",
        appKey: "7b6a2d3dd59f47a8998daf140fd1a1d0",
        appToken: "vtexappkey-storecomponents-XMFRVK",
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
