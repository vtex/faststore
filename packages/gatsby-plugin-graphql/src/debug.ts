export function debug(...args: any[]) {
  if (process.env.BABEL_GQL_DEBUG) {
    console.log('[gatsby-plugin-graphql]', ...args)
  }
}
