import storeConfig from '../../../discovery.config'

/**
 * Redirects to checkout. Use `resolvedCheckoutUrl` (e.g. from useLink().resolveLink)
 * when i18n is enabled so the URL has the correct locale/custom path.
 */
export const redirectToCheckout = (
  orderFormId?: string,
  resolvedCheckoutUrl?: string
) => {
  const baseUrl = resolvedCheckoutUrl ?? storeConfig.checkoutUrl
  const isDevEnv =
    window.location.host.includes('.vtex.app') ||
    window.location.host.includes('localhost')
  const href =
    isDevEnv && orderFormId
      ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}orderFormId=${orderFormId}`
      : baseUrl

  window.location.href = href
}
