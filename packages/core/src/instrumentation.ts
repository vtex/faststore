export async function register() {
  const isNodeRuntime = process.env.NEXT_RUNTIME === 'nodejs'
  const isProduction = process.env.NODE_ENV === 'production'
  const isVercel = !!process.env.VERCEL

  if (isNodeRuntime && isProduction && !isVercel) {
    await require('pino')
    await require('next-logger')
  }
}
