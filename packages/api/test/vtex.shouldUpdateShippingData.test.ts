import {
  OrderFormWithDifferentPostalCodeFromSession,
  OrderFormWithItems,
  OrderFormWithSamePostalCodeFromSession,
  emptyOrderForm,
  mockSession,
  mockSessionChangeDeliveryChannel,
  mockSessionInvalidDeliveryWindow,
  mockSessionValidDeliveryWindow,
} from '../mocks/shouldUpdateShippingData'
import { shouldUpdateShippingData } from '../src/platforms/vtex/utils/shouldUpdateShippingData'

describe('shouldUpdateShippingData', () => {
  it('For an empty items array at the OrderForm it should not update the Shipping Data', () => {
    const result = shouldUpdateShippingData(emptyOrderForm, mockSession)

    expect(result).toEqual({ updateShipping: false, addressChanged: false })
  })

  it('For an orderForm with items and without the shippingData set it should update the Shipping Data', () => {
    const result = shouldUpdateShippingData(OrderFormWithItems, mockSession)

    expect(result).toEqual({ updateShipping: true, addressChanged: true })
  })

  it('For an orderForm with items and with the address information set with the same information from the session it should not update the Shipping Data', () => {
    const result = shouldUpdateShippingData(
      OrderFormWithSamePostalCodeFromSession,
      mockSession
    )

    expect(result).toEqual({ updateShipping: false, addressChanged: false })
  })

  it('For an orderForm with items and with the address information set with a different information from the session it should  update the Shipping Data', () => {
    const result = shouldUpdateShippingData(
      OrderFormWithDifferentPostalCodeFromSession,
      mockSession
    )

    expect(result).toEqual({ updateShipping: true, addressChanged: true })
  })

  it('For an orderForm with items and with the delivery channel different from the session it should update the Shipping Data', () => {
    const result = shouldUpdateShippingData(
      OrderFormWithSamePostalCodeFromSession,
      mockSessionChangeDeliveryChannel
    )

    expect(result).toEqual({ updateShipping: true, addressChanged: false })
  })

  it('For an orderForm with items and with an invalid delivery window at the session it should not update the Shipping Data', () => {
    const result = shouldUpdateShippingData(
      OrderFormWithSamePostalCodeFromSession,
      mockSessionInvalidDeliveryWindow
    )

    expect(result).toEqual({ updateShipping: false, addressChanged: false })
  })

  it('For an orderForm with items and with a valid delivery window at the session it should update the Shipping Data', () => {
    const result = shouldUpdateShippingData(
      OrderFormWithSamePostalCodeFromSession,
      mockSessionValidDeliveryWindow
    )

    expect(result).toEqual({ updateShipping: true, addressChanged: false })
  })
})
