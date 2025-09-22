import { permanentRedirect } from '../navigation/server'
import { loadConfig } from '../config'

export async function CheckoutPage() {
  const config = await loadConfig()

  permanentRedirect(config.checkoutUrl)
}
