import { name, version } from '../package.json' with { type: 'json' }

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    ;(await import('@faststore/diagnostics')).getTelemetryClient({
      name,
      version,
    })
  }
}
