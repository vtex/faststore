import { parse } from 'cookie'
import { parseJwt } from 'src/utils/getCookie'

type GetIsRepresentativeParams = {
  headers?: Record<string, string>
  account: string
}

export function getIsRepresentative({
  headers,
  account,
}: GetIsRepresentativeParams): boolean {
  const authCookie = parse(headers?.cookie ?? '')?.[
    'VtexIdclientAutCookie_' + account
  ]
  const jwt = parseJwt(authCookie)

  const isRepresentative = jwt?.isRepresentative
  return !!isRepresentative
}
