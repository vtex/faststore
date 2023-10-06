import {
  IStoreGeoCoordinates,
  IStoreSession,
} from '../../../__generated__/schema'
import {
  CheckoutAddress,
  OrderForm,
  LogisticsInfo,
} from '../clients/commerce/types/OrderForm'

export const shouldUpdateShippingData = (
  orderForm: OrderForm,
  session: IStoreSession
) => {
  if (!hasSessionPostalCodeOrGeoCoordinates(session)) {
    return { updateShipping: false, addressChanged: false }
  }

  if (!hasItems(orderForm)) {
    return { updateShipping: false, addressChanged: false }
  }

  const [selectedAddress] = orderForm?.shippingData?.selectedAddresses ?? []
  if (
    checkPostalCode(selectedAddress, session.postalCode) ||
    checkGeoCoordinates(selectedAddress, session.geoCoordinates) ||
    checkAddressType(selectedAddress, session.addressType)
  ) {
    return { updateShipping: true, addressChanged: true }
  }

  // The logisticsInfo will always exist if there´s at least one item inside the cart
  const { logisticsInfo } = orderForm.shippingData!

  if (shouldUpdateDeliveryInfo(logisticsInfo, session)) {
    return { updateShipping: true, addressChanged: false }
  }
  return { updateShipping: false, addressChanged: false }
}

// Validate if theres any postal Code or GeoCoordinates set at the session
const hasSessionPostalCodeOrGeoCoordinates = (session: IStoreSession) => {
  return (
    !!session.postalCode ||
    (session.geoCoordinates?.latitude && session.geoCoordinates?.longitude)
  )
}

// Validate if theres a difference between the session postal code and orderForm postal code
const checkPostalCode = (
  address: CheckoutAddress | null,
  postalCode: string | null | undefined
) => {
  return typeof postalCode === 'string' && address?.postalCode !== postalCode
}

// Validate if theres a difference between the session geoCoords and orderForm geoCoords
const checkGeoCoordinates = (
  address: CheckoutAddress | null,
  geoCoordinates: IStoreGeoCoordinates | null | undefined
) => {
  return (
    typeof geoCoordinates?.latitude === 'number' &&
    typeof geoCoordinates?.longitude === 'number' &&
    (address?.geoCoordinates[0] !== geoCoordinates?.longitude ||
      address?.geoCoordinates[1] !== geoCoordinates?.latitude)
  )
}

const checkAddressType = (
  address: CheckoutAddress | null,
  addressType: string | null | undefined
) => {
  return typeof addressType === 'string' && address?.addressType !== addressType
}

// Validate if theres any item inside the orderForm
const hasItems = (orderForm: OrderForm) => {
  return orderForm.items.length !== 0
}

const shouldUpdateDeliveryInfo = (
  logisticsInfo: LogisticsInfo[],
  session: IStoreSession | null
) => {
  const deliveryChannel = session?.deliveryMode?.deliveryChannel
  const deliveryMethod = session?.deliveryMode?.deliveryMethod
  const { startDate, endDate } = session?.deliveryMode?.deliveryWindow || {}

  return logisticsInfo.some(
    ({ selectedDeliveryChannel, selectedSla, slas }) => {
      const checkDeliveryChannel =
        deliveryChannel && selectedDeliveryChannel !== deliveryChannel
      const checkDeliveryMethod =
        deliveryMethod && selectedSla !== deliveryMethod

      return slas?.some((sla) => {
        if (
          (checkDeliveryChannel && sla.deliveryChannel === deliveryChannel) ||
          (checkDeliveryMethod && sla.id === deliveryMethod)
        ) {
          return true
        }
        return (
          startDate &&
          endDate &&
          sla.deliveryChannel === deliveryChannel &&
          sla.id === deliveryMethod &&
          (!sla?.deliveryWindow ||
            sla?.deliveryWindow?.startDateUtc !== startDate ||
            sla?.deliveryWindow?.endDateUtc !== endDate) &&
          sla.availableDeliveryWindows?.some(
            (window) =>
              window?.startDateUtc === startDate &&
              window?.endDateUtc === endDate
          )
        )
      })
    }
  )
}
