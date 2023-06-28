import { IStoreSession } from '../../../__generated__/schema'
import { IncrementedAddress } from '../clients/commerce/types/IncrementedAddress'
import { SelectedAddress } from '../clients/commerce/types/ShippingData'

export const createNewAddress = (
  session: IStoreSession,
  incrementedAddress?: IncrementedAddress
) => {
  const postalCode = session.postalCode
  const geoCoordinates = session.geoCoordinates

  // If the address from the session has changed and it do not exist we will create the new one
  const addressSession: SelectedAddress = {
    addressType: session.addressType || null,
    postalCode: postalCode || incrementedAddress?.postalCode || null,
    city: incrementedAddress?.city || null,
    state: incrementedAddress?.state || null,
    country: session.country || incrementedAddress?.country || null,
    street: incrementedAddress?.street || null,
    number: incrementedAddress?.number || null,
    neighborhood: incrementedAddress?.neighborhood || null,
    complement: incrementedAddress?.complement || null,
    reference: incrementedAddress?.reference || null,
    geoCoordinates: [], // Initialize with default value
  }

  if (geoCoordinates) {
    const latitude =
      typeof geoCoordinates === 'object' && 'latitude' in geoCoordinates
        ? geoCoordinates.latitude
        : null
    const longitude =
      typeof geoCoordinates === 'object' && 'longitude' in geoCoordinates
        ? geoCoordinates.longitude
        : null
    addressSession.geoCoordinates =
      latitude !== null && longitude !== null
        ? [longitude, latitude]
        : incrementedAddress?.geoCoordinates || []
  }

  return [addressSession]
}
