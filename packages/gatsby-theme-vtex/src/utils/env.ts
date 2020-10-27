export const isServer = typeof window === 'undefined'

// Based on: https://github.com/monperrus/crawler-user-agents
export const isBot =
  !isServer &&
  /(googlebot\/|bot|Googlebot-Mobile|bingbot)/i.test(navigator.userAgent)

console.log('userAgent', !isServer && navigator.userAgent)

export const isProduction = process.env.NODE_ENV === 'production'

export const isDevelopment = !isProduction
