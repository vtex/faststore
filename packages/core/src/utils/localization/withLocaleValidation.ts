import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { validateLocaleForHostname } from './validateLocaleForHostname'

type ServerPropsHandler<P> = (
  context: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<P>>

/**
 * Higher Order Function that validates locale binding before executing getServerSideProps
 * @param getServerSidePropsFn - The original getServerSideProps function
 * @returns getServerSideProps function with locale binding validation
 */
export function withLocaleValidationSSR<P extends Record<string, any>>(
  getServerSidePropsFn: ServerPropsHandler<P>
): ServerPropsHandler<P> {
  return async (context: GetServerSidePropsContext) => {
    const { locale, req } = context

    const hostname = req.headers.host || ''

    if (!locale) {
      // If there's no locale in context, execute original function
      return getServerSidePropsFn(context)
    }

    const isValid = validateLocaleForHostname(hostname, locale)

    if (!isValid) {
      return {
        notFound: true,
      }
    }

    return getServerSidePropsFn(context)
  }
}
