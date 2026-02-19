export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { name, version } = await import('../package.json', {
      with: { type: 'json' },
    })
    ;(await import('@faststore/diagnostics')).getTelemetryClient({
      name,
      version,
    })
  }
}
