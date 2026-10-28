import storeConfig from 'discovery.config'

const parseHostname = (url: unknown): string | undefined => {
  if (typeof url !== 'string' || !url) {
    return undefined
  }

  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return undefined
  }
}

/**
 * Common parent of the store host and the checkout host (`secureSubdomain`)
 * when checkout runs on a sibling host: `www.store.com` and `secure.store.com`
 * share `store.com`.
 *
 * Returns `undefined` when a cookie scoped to the store host already reaches
 * checkout (same host, or checkout on a subdomain of it), and when the hosts
 * share fewer than two labels.
 */
export const getCheckoutParentDomain = (
  hostname: string
): string | undefined => {
  const checkoutHostname = parseHostname(storeConfig.secureSubdomain)

  if (!checkoutHostname) {
    return undefined
  }

  const storeLabels = hostname.toLowerCase().split('.').reverse()
  const checkoutLabels = checkoutHostname.split('.').reverse()
  const common: string[] = []

  for (
    let index = 0;
    index < Math.min(storeLabels.length, checkoutLabels.length) &&
    storeLabels[index] === checkoutLabels[index];
    index++
  ) {
    common.push(storeLabels[index])
  }

  if (common.length < 2) {
    return undefined
  }

  const parent = common.reverse().join('.')

  return parent === hostname.toLowerCase() ? undefined : parent
}
