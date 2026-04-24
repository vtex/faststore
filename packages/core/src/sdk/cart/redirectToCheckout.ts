import storeConfig from '../../../discovery.config'

export const redirectToCheckout = (orderFormId?: string) => {
  const isDevEnv =
    window.location.host.includes('.vtex.app') ||
    window.location.host.includes('localhost')

  if (!isDevEnv) {
    window.location.href = `${storeConfig.checkoutUrl}`
  } else if (orderFormId) {
    window.location.href = `${storeConfig.checkoutUrl}?orderFormId=${orderFormId}`
  } else {
    window.location.href = `${storeConfig.checkoutUrl}`
  }
}
