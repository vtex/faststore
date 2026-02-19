export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { name, version } = await import('../package.json')
    const { api } = await import('../discovery.config')
    ;(await import('@faststore/diagnostics')).getTelemetryClient({
      name,
      version,
      account: api.storeId,
    })
  }
}
