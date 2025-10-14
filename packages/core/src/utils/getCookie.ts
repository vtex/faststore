export function getCookie(name: string): string | undefined {
  const cookieString = decodeURIComponent(document.cookie)
  const cookies = cookieString.split(';')

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')

    if (cookieName === name) {
      return cookieValue
    }
  }

  return undefined // Cookie not found
}

export function parseJwt(token: string) {
  if (!token) {
    return null
  }
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}
