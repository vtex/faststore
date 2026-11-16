import type { Context } from '..'
import type { IStoreSession } from '../../../__generated__/schema'

/**
 * Fills the session coordinates from its postal code. An address created
 * without coordinates keeps none in the orderForm, and Checkout lists no
 * pickup points for it.
 */
export const withGeoCoordinates = async (
  session: IStoreSession,
  commerce: Context['clients']['commerce']
): Promise<IStoreSession> => {
  const { postalCode, country, geoCoordinates } = session

  if (!postalCode || !country || geoCoordinates) {
    return session
  }

  try {
    const address = await commerce.checkout.address({ postalCode, country })
    const [longitude, latitude] = address.geoCoordinates ?? []

    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      return session
    }

    return { ...session, geoCoordinates: { latitude, longitude } }
  } catch (error) {
    // A failed lookup must not fail the cart validation.
    console.warn(
      'Error while getting geo coordinates for the cart address. Sending it without coordinates.',
      error
    )

    return session
  }
}
