import { ForbiddenError } from '../../..'

/**
 * Creates a function that adds VTEX API AppKey and AppToken headers to requests.
 * These credentials are used for server-to-server authentication with VTEX APIs.
 *
 * @returns A function that accepts additional headers and returns them merged with authentication headers
 * @throws {ForbiddenError} When FS_DISCOVERY_APP_KEY or FS_DISCOVERY_APP_TOKEN environment variables are not set
 */
export const getWithAppKeyAndToken = () => {
  return function withAppKeyAndToken<T extends Record<string, string>>(
    additionalHeaders: T = {} as T
  ): T & { 'X-VTEX-API-AppKey': string; 'X-VTEX-API-AppToken': string } {
    const appKey = process.env.FS_DISCOVERY_APP_KEY ?? ''
    const appToken = process.env.FS_DISCOVERY_APP_TOKEN ?? ''

    if (!appKey || !appToken) {
      throw new ForbiddenError('No authentication AppKey and AppToken passed.')
    }

    return {
      ...additionalHeaders,
      'X-VTEX-API-AppKey': appKey,
      'X-VTEX-API-AppToken': appToken,
    }
  }
}
