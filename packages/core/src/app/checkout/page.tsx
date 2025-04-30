import { permanentRedirect } from 'next/navigation'
import storeConfig from 'discovery.config'

/**
 * This redirect is here to keep the same behavior of the legacy faststore
 * TODO: We must evaluate changing it to the Next config
 */
export default function CheckoutRedirect() {
  permanentRedirect(storeConfig.checkoutUrl)
}
