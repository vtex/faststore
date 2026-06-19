import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { localizeRedirectResult } from './getLocalizedRedirect'
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
      return localizeRedirectResult(
        context,
        await getServerSidePropsFn(context)
      )
    }

    // Skip locale validation for private/authenticated routes.
    // resolvedUrl is locale-stripped by Next.js; req.url may still include the prefix.
    const pathname = context.resolvedUrl?.split('?')[0] ?? ''
    if (pathname.startsWith('/pvt/')) {
      return localizeRedirectResult(
        context,
        await getServerSidePropsFn(context)
      )
    }

    const isValid = validateLocaleForHostname(hostname, locale)

    if (!isValid) {
      return {
        notFound: true,
      }
    }

    return localizeRedirectResult(context, await getServerSidePropsFn(context))
  }
}
