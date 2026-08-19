import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { validateLocaleForHostname } from './validateLocaleForHostname'

type ServerPropsHandler<
  P,
  C extends GetServerSidePropsContext = GetServerSidePropsContext,
> = (context: C) => Promise<GetServerSidePropsResult<P>>

/**
 * Higher Order Function that validates locale binding before executing getServerSideProps
 * @param getServerSidePropsFn - The original getServerSideProps function
 * @returns getServerSideProps function with locale binding validation
 */
export function withLocaleValidationSSR<
  P extends Record<string, any>,
  C extends GetServerSidePropsContext = GetServerSidePropsContext,
>(getServerSidePropsFn: ServerPropsHandler<P, C>): ServerPropsHandler<P, C> {
  return async (context: C) => {
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
