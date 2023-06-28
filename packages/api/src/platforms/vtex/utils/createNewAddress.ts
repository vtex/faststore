import { IStoreSession } from '../../../__generated__/schema'
import { SelectedAddress } from '../clients/commerce/types/ShippingData'

export const createNewAddress = (session: IStoreSession) => {
  const postalCode = session.postalCode
  const geoCoordinates = session.geoCoordinates

  // If the address from the session has changed and it do not exist we will create the new one
  const addressSession: SelectedAddress = {
    addressType: session.addressType || null,
    postalCode: postalCode || null,
    city: null,
    state: null,
    country: session.country || null,
    street: null,
    number: null,
    neighborhood: null,
    complement: null,
    reference: null,
    geoCoordinates: [],
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
      latitude !== null && longitude !== null ? [longitude, latitude] : []
  }

  return [addressSession]
}
