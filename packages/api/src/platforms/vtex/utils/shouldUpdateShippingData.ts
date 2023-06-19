import { IStoreSession } from '../../../__generated__/schema'
import { OrderForm } from '../clients/commerce/types/OrderForm'

export const shouldUpdateShippingData = (
  orderForm: OrderForm,
  session: IStoreSession
) => {
  if (
    orderForm.items.length === 0 ||
    !orderForm.shippingData ||
    !orderForm.shippingData.logisticsInfo ||
    orderForm.shippingData.logisticsInfo.length === 0
  ) {
    return false
  }

  const { address, logisticsInfo } = orderForm.shippingData

  const hasDifferentPostalCode =
    typeof session.postalCode === 'string' &&
    address?.postalCode !== session.postalCode
  const hasDifferentGeoCoordinates =
    typeof session.geoCoordinates === 'object' &&
    typeof session.geoCoordinates?.latitude === 'number' &&
    typeof session.geoCoordinates?.longitude === 'number' &&
    (address?.geoCoordinates[0] !== session.geoCoordinates?.longitude ||
      address?.geoCoordinates[1] !== session.geoCoordinates?.latitude)
  const hasDifferentDeliveryMode =
    session.deliveryMode &&
    logisticsInfo.some(
      (info) =>
        info.selectedDeliveryChannel !==
          (session.deliveryMode?.deliveryChannel ?? '') ||
        info.selectedSla !== (session.deliveryMode?.deliveryMethod ?? '') ||
        (info.slas.length > 0 &&
          info.slas.some(
            (sla) =>
              sla.deliveryWindow?.startDateUtc !==
                (session.deliveryMode?.deliveryWindow?.startDate ?? '') ||
              sla.deliveryWindow?.endDateUtc !==
                (session.deliveryMode?.deliveryWindow?.endDate ?? '')
          ))
    )

  return (
    hasDifferentPostalCode ||
    hasDifferentGeoCoordinates ||
    hasDifferentDeliveryMode
  )
}
