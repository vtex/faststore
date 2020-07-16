import './setup'

module.exports = {
  plugins: [
    {
      resolve: require.resolve('gatsby-plugin-nginx-redirect'),
      options: {
        inputConfigFile: `${__dirname}/nginx.conf`,
        outputConfigFile: `${process.cwd()}/public/nginx.conf`,
      },
    },
  ],
}
