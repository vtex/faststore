import { IStoreSession } from '../../../__generated__/schema'
import { OrderForm } from '../clients/commerce/types/OrderForm'

export const getAddressOrderForm = (
  orderForm: OrderForm,
  session: IStoreSession,
  addressChanged: boolean
) => {
  const postalCode = session.postalCode
  const geoCoordinates = session.geoCoordinates
  const availableAddresses = orderForm?.shippingData?.availableAddresses ?? []
  console.log("Addres Info", addressChanged)
  // Validate if no change for the address was made and the deliveryMode has changed we can return the address from the orderForm
  if (!addressChanged) {
    console.log("Address not changed", orderForm?.shippingData?.selectedAddresses[0])
    return [orderForm?.shippingData?.selectedAddresses[0]]
  }

  // Validate if the address from the session already exists at the availableAddresses from the OrderForm to avoid duplication
  if (addressChanged && availableAddresses.length > 0) {
    console.log("Address Changed")
    for (const address of availableAddresses) {
      if (postalCode && geoCoordinates) {
        const addressMatcher =
          address.postalCode === postalCode &&
          address.geoCoordinates[0] === geoCoordinates.longitude &&
          address.geoCoordinates[1] === geoCoordinates.latitude
        if (addressMatcher) {
          console.log("PostalCode + Geo", address )
          return [address]
        }
      } 
      if (postalCode && !geoCoordinates) {
        const addressMatcher = address.postalCode === postalCode
        if (addressMatcher) {
          console.log("PostalCode", address )
          return [address]
        }
      } 
      if (geoCoordinates && !postalCode) {
        const addressMatcher =
          address.geoCoordinates[0] === geoCoordinates.longitude &&
          address.geoCoordinates[1] === geoCoordinates.latitude
        if (addressMatcher) {
          console.log("PostalCode", address )
          return [address]
        }

      }
    }
  }

  return null
}
