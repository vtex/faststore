import React, { useState, FC } from 'react'
import { Button } from '@vtex/store-ui'

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
          onClick={() => setShowEstimateShipping(true)}
        >
          View delivery options
        </Button>
      )}
    </div>
  )
}
