const SECONDS = 60
// const MINUTES = 60
// const MILLISECONDS = 1000

export function withConfigContext(config: any) {
  return (next?: APIHandler): APIHandler => {
    return (req, res, context) => {
      context = {
        refreshToken: false,
        staleWhileRevalidate: SECONDS,
        maxAge: 0, // 0 disables cache, 5 * 60 enable cache control maxAge 5 minutes
        ...context,
      }

      context['refreshToken'] ??= !!config?.experimental?.refreshToken
      context['storeId'] ??= config?.api?.storeId
      context['maxAge'] ??= config?.api?.storeId
      context['staleWhileRevalidate'] ??=
        config.experimental.graphqlCacheControl?.staleWhileRevalidate
      context['maxAge'] ??= config?.experimental?.graphqlCacheControl?.maxAge

      next?.(req, res, context)
    }
  }
}
