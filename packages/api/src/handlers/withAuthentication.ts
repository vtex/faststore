import { parse as parseCookies } from 'cookie'
import { UnauthorizedError } from '../platforms/errors'
const MILLISECONDS = 1000

export function withAuthentication(next?: APIHandler): APIHandler {
  return (request, response, context) => {
    // If is not validateSession operation or context.refreshToken is not present should not execute the handler
    if (
      (context.operationName === 'ValidateSession' && context.refreshToken) ===
      false
    ) {
      return next?.(request, response, context)
    }

    try {
      context['token'] = getToken(request, context)
    } catch (error) {
      return response
        .status(500)
        .send(`Invalid Token encoding \nerror: ${error}`)
    }

    const jwtToken = context.token

    const NOW = Math.floor(Date.now() / MILLISECONDS)

    const isTokenExpired = !!jwtToken && NOW > Number(jwtToken.exp)
    const refreshAfter = context.variables?.session?.refreshAfter
    const refreshAfterExist = !!refreshAfter
    const refreshAfterExpired = refreshAfter
      ? NOW > Number(refreshAfter)
      : false

    const tokenExistAndIsFirstRefreshTokenRequest =
      !!jwtToken && !refreshAfterExist

    // when token expired, browser clears the cookie, but we still have the refreshAfter in session and the refresh token cookie
    const tokenNotExistAndRefreshAfterExistAndIsExpired =
      !jwtToken && !!refreshAfterExist && refreshAfterExpired

    const tokenExpiredAndRefreshAfterIsNullOrExpired =
      isTokenExpired && (!refreshAfterExist || refreshAfterExpired)

    const shouldRefreshToken =
      tokenExistAndIsFirstRefreshTokenRequest ||
      tokenNotExistAndRefreshAfterExistAndIsExpired ||
      tokenExpiredAndRefreshAfterIsNullOrExpired

    if (shouldRefreshToken) {
      throw new UnauthorizedError(
        'Unauthorized: Token expired. Please login again or refresh the page.'
      )
    }

    return next?.(request, response, context)
  }
}

const getToken = ({ headers }: APIRequest, context: Context) => {
  const cookieName = 'VtexIdclientAutCookie_' + (context.storeId || '')
  const cookies = parseCookies([...(headers?.cookie ?? '')].join(''))
  const stringToken: string | undefined = cookies[cookieName]

  if (!stringToken) {
    return null
  }

  return JSON.parse(Buffer.from(stringToken.split('.')[1], 'base64').toString())
}
