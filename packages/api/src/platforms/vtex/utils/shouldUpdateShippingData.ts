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
    return false
  }

  const { address } = orderForm.shippingData ?? { address: null }

  if (checkPostalCode(address, session.postalCode)) {
    return true
  }

  if (checkGeoCoordinates(address, session.geoCoordinates)) {
    return true
  }

  if (!hasItems(orderForm)) {
    return false
  }

  // The logisticsInfo will always exist if there´s at least one item inside the cart
  const { logisticsInfo } = orderForm.shippingData!

  if (shouldUpdateDeliveryChannel(logisticsInfo, session)) {
    return true
  }

  if (shouldUpdateDeliveryMethod(logisticsInfo, session)) {
    return true
  }

  if (shouldUpdateDeliveryWindow(logisticsInfo, session)) {
    return true
  }
  return false
}

// Validate if theres any postal Code or GeoCoordinates set at the session
const hasSessionPostalCodeOrGeoCoordinates = (session: IStoreSession) => {
  return (
    !!session.postalCode ||
    (session.geoCoordinates &&
      session.geoCoordinates.latitude &&
      session.geoCoordinates.longitude)
  )
}

// Validate if theres a difference between the session postal code and orderForm postal code
const checkPostalCode = (
  address: CheckoutAddress | null | undefined,
  postalCode: string | null | undefined
) => {
  return typeof postalCode === 'string' && address?.postalCode !== postalCode
}

// Validate if theres a difference between the session geoCoords and orderForm geoCoords
const checkGeoCoordinates = (
  address: CheckoutAddress | null | undefined,
  geoCoordinates: IStoreGeoCoordinates | null | undefined
) => {
  return (
    typeof geoCoordinates?.latitude === 'number' &&
    typeof geoCoordinates?.longitude === 'number' &&
    (address?.geoCoordinates[0] !== geoCoordinates?.longitude ||
      address?.geoCoordinates[1] !== geoCoordinates?.latitude)
  )
}

// Validate if theres any item inside the orderForm
const hasItems = (orderForm: OrderForm) => {
  return orderForm.items.length !== 0
}

// Validate if the deliveryChannel from the session is different from the selected delivery channel
// and if so needs to validate if the deliveryChannel for the session is available inside the slas for the item
const shouldUpdateDeliveryChannel = (
  logisticsInfo: LogisticsInfo[],
  session: IStoreSession | null | undefined
) => {
  if (!session?.deliveryMode?.deliveryChannel) {
    return false
  }
  const { deliveryChannel } = session.deliveryMode
  for (const item of logisticsInfo) {
    if (item.selectedDeliveryChannel !== deliveryChannel) {
      const matchingSla = item.slas.find(
        (sla) => sla.deliveryChannel === deliveryChannel
      )
      if (matchingSla) {
        return true
      }
    }
  }
  return false
}

// Validate if the deliveryMethod from the session is different from the selectedSLA
// and if so needs to validate if the deliveryMethod for the session is available inside the slas for the item
const shouldUpdateDeliveryMethod = (
  logisticsInfo: LogisticsInfo[],
  session: IStoreSession
) => {
  if (!session?.deliveryMode?.deliveryMethod) {
    return false
  }
  const { deliveryMethod } = session.deliveryMode
  for (const item of logisticsInfo) {
    if (item.selectedSla !== deliveryMethod) {
      const matchingSla = item.slas.find((sla) => sla.id === deliveryMethod)
      if (matchingSla) {
        return true
      }
    }
  }
  return false
}

// Validate if the deliveryWindow from the session is different from the deliveryWindow of the SLA
// and if so needs to validate if the deliveryWindow for the session is available inside the availableDeliveryWindows for the item
const shouldUpdateDeliveryWindow = (
  logisticsInfo: LogisticsInfo[],
  session: IStoreSession
) => {
  if (
    !session?.deliveryMode?.deliveryWindow?.startDate ||
    !session?.deliveryMode?.deliveryWindow?.endDate
  ) {
    return false
  }
  const { startDate, endDate } = session.deliveryMode.deliveryWindow
  for (const item of logisticsInfo) {
    for (const sla of item.slas) {
      const matchingWindow = sla.availableDeliveryWindows?.some(
        (window) =>
          window.startDateUtc === startDate && window.endDateUtc === endDate
      )
      if (matchingWindow) {
        return true
      }
    }
  }
  return false
}
