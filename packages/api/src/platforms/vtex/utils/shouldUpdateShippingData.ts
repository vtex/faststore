import {
  IStoreDeliveryMode,
  IStoreDeliveryWindow,
  IStoreGeoCoordinates,
  IStoreSession,
} from '../../../__generated__/schema'
import {
  CheckoutAddress,
  OrderForm,
  LogisticsInfo,
  DeliveryWindow,
  SLA,
} from '../clients/commerce/types/OrderForm'

export const shouldUpdateShippingData = (
  orderForm: OrderForm,
  session: IStoreSession
) => {
  if (
    orderForm.items.length === 0 ||
    !orderForm.shippingData?.logisticsInfo ||
    orderForm.shippingData.logisticsInfo.length === 0
  ) {
    return false
  }

  const { address, logisticsInfo } = orderForm.shippingData

  const hasDifferentPostalCode = checkPostalCode(address, session.postalCode)
  if (hasDifferentPostalCode) {
    return true
  }
  const hasDifferentGeoCoordinates = checkGeoCoordinates(
    address,
    session.geoCoordinates
  )
  if (hasDifferentGeoCoordinates) {
    return true
  }
  const hasDifferentDeliveryMode = checkDeliveryMode(
    session.deliveryMode,
    logisticsInfo
  )
  if (hasDifferentDeliveryMode) {
    return true
  } 
  return false
}

const checkPostalCode = (
  address: CheckoutAddress | null,
  postalCode: string | null | undefined
) => {
  return typeof postalCode === 'string' && address?.postalCode !== postalCode
}

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

const checkDeliveryMode = (
  deliveryMode: IStoreDeliveryMode | null | undefined,
  logisticsInfo: LogisticsInfo[]
) => {
  return (
    deliveryMode &&
    logisticsInfo.some((itemLogistics) =>
      checkDeliveryInfo(itemLogistics, deliveryMode)
    )
  )
}

const checkDeliveryInfo = (
  itemLogistics: LogisticsInfo,
  deliveryMode: IStoreDeliveryMode | null | undefined
) => {
  return (
    checkDeliveryChannel(
      itemLogistics.selectedDeliveryChannel,
      deliveryMode?.deliveryChannel
    ) ||
    checkSelectedSla(itemLogistics.selectedSla, deliveryMode?.deliveryMethod) ||
    itemLogistics.slas.some((sla) =>
    checkDeliveryWindow(sla.deliveryWindow, deliveryMode?.deliveryWindow)
  )
  )
}

const checkDeliveryChannel = (
  selectedDeliveryChannel: string | null,
  deliveryChannel: string | undefined
) => {
  return selectedDeliveryChannel !== (deliveryChannel ?? '')
}

const checkSelectedSla = (
  selectedSla: string | null,
  deliveryMethod: string | undefined
) => {
  return selectedSla !== (deliveryMethod ?? '')
}

const checkDeliveryWindow = (
  deliveryWindow: DeliveryWindow | null,
  sessionDeliveryWindow: IStoreDeliveryWindow | null | undefined
) => {
  return (
    deliveryWindow?.startDateUtc !== (sessionDeliveryWindow?.startDate ?? '') ||
    deliveryWindow?.endDateUtc !== (sessionDeliveryWindow?.endDate ?? '')
  )
}
