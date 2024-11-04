import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'faststore-api-beta' })
}

console.log('Running instrumentation')
