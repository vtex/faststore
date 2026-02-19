export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { name, version } = await import('../package.json')
    ;(await import('@faststore/diagnostics')).getTelemetryClient({
      name,
      version,
    })
  }
}
