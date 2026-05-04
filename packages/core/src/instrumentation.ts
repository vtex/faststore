export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const isProduction = process.env.NODE_ENV === 'production'
    const isVercel = !!process.env.VERCEL

    if (isProduction && !isVercel) {
      await require('pino')
      await require('next-logger')
    }
  }
}
