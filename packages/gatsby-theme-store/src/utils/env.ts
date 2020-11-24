export const isServer = typeof window === 'undefined'

// Based on: https://github.com/monperrus/crawler-user-agents
// Shink the number of possible bots for performance reasons
export const isBot =
  !isServer &&
  /(googlebot\/|bot|Googlebot-Mobile|bingbot)/i.test(navigator.userAgent)

export const isProduction = process.env.NODE_ENV === 'production'

export const isDevelopment = !isProduction
