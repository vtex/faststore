import React, { useState, FC } from 'react'
import { Button } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { EstimateShipping } from './EstimateShipping'
import { useShipping } from './ShippingContext'

export const ShippingCalculator: FC = () => {
  const {
    canEditData,
    countries,
    deliveryOptions,
    insertAddress,
    loading,
    numberOfItems,
    numberOfUnavailableItems,
    selectDeliveryOption,
    selectedAddress,
  } = useShipping()

  const intl = useIntl()

  const shouldShowShippingEstimate =
    selectedAddress && !!selectedAddress.postalCode

  const [showEstimateShipping, setShowEstimateShipping] = useState<boolean>(
    shouldShowShippingEstimate
  )

  if (loading) {
    return <>loading...</>
  }

  return (
    <div>
      {showEstimateShipping || shouldShowShippingEstimate ? (
        <EstimateShipping
          canEditData={canEditData}
          selectedAddress={selectedAddress}
          deliveryOptions={deliveryOptions}
          countries={countries}
          insertAddress={insertAddress}
          selectDeliveryOption={selectDeliveryOption}
          numberOfItems={numberOfItems}
          numberOfUnavailableItems={numberOfUnavailableItems}
        />
      ) : (
        <Button
          id="view-delivery-options"
          variant="plain"
          onClick={() => setShowEstimateShipping(true)}
        >
          {intl.formatMessage({
            id: 'shipping-calculator.view-delivery-options',
          })}
        </Button>
      )}
    </div>
  )
}
