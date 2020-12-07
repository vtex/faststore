import { Options } from './gatsby-node'

/**
 * Create all proxy rules.
 * If adding a new rule, don't forget to create a redirect in ./gatsby-node.ts
 * so the redirect works in production websites as well
 */
module.exports = ({ tenant, workspace, environment }: Options) => ({
  proxy: [
    {
      prefix: '/api/io',
      url: `https://${workspace}--${tenant}.myvtex.com`,
    },
    {
      prefix: '/api',
      url: `https://${tenant}.${environment}.com.br`,
    },
    {
      prefix: '/checkout',
      url: `https://${workspace}--${tenant}.myvtex.com`,
    },
    {
      prefix: '/arquivos',
      url: `https://${tenant}.vtexassets.com`,
    },
    {
      prefix: '/files',
      url: `https://${tenant}.vtexassets.com`,
    },
    {
      prefix: '/graphql',
      url: `https://${workspace}--${tenant}.myvtex.com`,
    },
    {
      prefix: '/sitemap.xml',
      url: `https://${workspace}--${tenant}.myvtex.com`,
    },
    {
      prefix: '/sitemap',
      url: `https://${workspace}--${tenant}.myvtex.com`,
    },
    {
      prefix: '/XMLData',
      url: `https://${tenant}.${environment}.com.br`,
    },
  ],
})
