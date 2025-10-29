export function withConfigContext(config: any) {
  return (next?: APIHandler): APIHandler => {
    return (req, res, context) => {
      context = {
        config: config ?? {},
        refreshToken: false,
        ...context,
      }

      context['refreshToken'] ??= !!config?.experimental?.refreshToken
      context['storeId'] ??= config?.api?.storeId

      next?.(req, res, context)
    }
  }
}
