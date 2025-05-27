import { parse } from 'cookie'
import { parseJwt } from 'src/utils/getCookie'

export function getIsRepresentative({
  headers,
  account,
}: { headers: Record<string, string>; account: string }) {
  const authCookie = parse(headers?.cookie ?? '')?.[
    'VtexIdclientAutCookie_' + account
  ]
  const jwt = parseJwt(authCookie)

  const isRepresentative = jwt?.isRepresentative
  return isRepresentative
}
