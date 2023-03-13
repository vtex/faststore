export const getCookie = (name: string, cookie: string): string => {
  const value = `; ${cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts?.pop()?.split(';').shift() ?? ''
  }
  return ''
}
