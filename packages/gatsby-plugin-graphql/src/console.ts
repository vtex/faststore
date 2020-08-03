export const debug = (...args: any[]) => {
  if (process.env.BABEL_GQL_DEBUG) {
    console.log('[gatsby-plugin-graphql]', ...args)
  }
}

export const error = (...args: any[]) => {
  console.error('[gatsby-plugin-graphql]', ...args)
}
