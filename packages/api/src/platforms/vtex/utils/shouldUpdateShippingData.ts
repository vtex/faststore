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

  const [selectedAddress] = orderForm?.shippingData?.selectedAddresses ?? []

  if (
    checkPostalCode(selectedAddress, session.postalCode) ||
    checkGeoCoordinates(
      selectedAddress,
      session.geoCoordinates,
      session.postalCode
    ) ||
    checkAddressType(selectedAddress, session.addressType)
  ) {
    return { updateShipping: true, addressChanged: true }
  }

  if (!hasItems(orderForm)) {
    return { updateShipping: false, addressChanged: false }
  }

  // The logisticsInfo will always exist if there´s at least one item inside the cart
  const { logisticsInfo } = orderForm.shippingData!

  if (
    shouldUpdateDeliveryChannel(logisticsInfo, session) ||
    shouldUpdateDeliveryMethod(logisticsInfo, session) ||
    shouldUpdateDeliveryWindow(logisticsInfo, session)
  ) {
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
  geoCoordinates: IStoreGeoCoordinates | null | undefined,
  postalCode: string | null | undefined
) => {
  return (
    typeof geoCoordinates?.latitude === 'number' &&
    typeof geoCoordinates?.longitude === 'number' &&
    (address?.geoCoordinates[0] !== geoCoordinates?.longitude ||
      address?.geoCoordinates[1] !== geoCoordinates?.latitude) &&
    address?.postalCode !== postalCode
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

// Validate if the deliveryChannel from the session is different from the selected delivery channel
// and if so needs to validate if the deliveryChannel for the session is available inside the slas for the item
const shouldUpdateDeliveryChannel = (
  logisticsInfo: LogisticsInfo[],
  session: IStoreSession | null
) => {
  const deliveryChannel = session?.deliveryMode?.deliveryChannel
  return (
    !!deliveryChannel &&
    logisticsInfo.some((item) => {
      const matchingSla = item?.slas?.find(
        (sla) => sla.deliveryChannel === deliveryChannel
      )
      return !!matchingSla
    })
  )
}

// Validate if the deliveryMethod from the session is different from the selectedSLA
// and if so needs to validate if the deliveryMethod for the session is available inside the slas for the item
const shouldUpdateDeliveryMethod = (
  logisticsInfo: LogisticsInfo[],
  session: IStoreSession
) => {
  const deliveryMethod = session?.deliveryMode?.deliveryMethod
  return (
    !!deliveryMethod &&
    logisticsInfo.some((item) => {
      const matchingSla = item?.slas?.find((sla) => sla.id === deliveryMethod)
      return !!matchingSla
    })
  )
}

// Validate if the deliveryWindow from the session is different from the deliveryWindow of the SLA
// and if so needs to validate if the deliveryWindow for the session is available inside the availableDeliveryWindows for the item
const shouldUpdateDeliveryWindow = (
  logisticsInfo: LogisticsInfo[],
  session: IStoreSession
) => {
  const { startDate, endDate } = session?.deliveryMode?.deliveryWindow || {}
  return (
    !!startDate &&
    !!endDate &&
    logisticsInfo?.some((item) => {
      return item?.slas?.some((sla) => {
        return sla?.availableDeliveryWindows?.some(
          (window) =>
            window?.startDateUtc === startDate && window?.endDateUtc === endDate
        )
      })
    })
  )
}
