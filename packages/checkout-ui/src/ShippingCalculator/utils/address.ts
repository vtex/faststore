import { getGUID } from './guid'
import { NewAddress } from '../types'

export function newAddress(address?: NewAddress) {
  return {
    addressId: address?.addressId ?? getGUID(),
    addressType: address?.addressType ?? 'residential',
    city: address?.city ?? '',
    complement: address?.complement ?? '',
    country: address?.country ?? '',
    geoCoordinates: address?.geoCoordinates ?? [],
    neighborhood: address?.neighborhood ?? '',
    number: address?.number ?? '',
    postalCode: address?.postalCode ?? '',
    receiverName: address?.receiverName ?? '',
    reference: address?.reference ?? '',
    state: address?.state ?? '',
    street: address?.street ?? '',
    addressQuery: address?.addressQuery ?? '',
  }
}
