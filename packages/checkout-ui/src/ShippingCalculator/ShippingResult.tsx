import React, { FC, Fragment } from 'react'
import { helpers } from '@vtex/address-form'
import { Button } from '@vtex/store-ui'

import { AddressWithValidation, DeliveryOption } from './types'
import { ShippingOptions } from './ShippingOptions'

const { removeValidation } = helpers

interface CustomProps {
  address: AddressWithValidation
  canEditData: boolean
  options: DeliveryOption[]
  setShowResult: (showResult: boolean) => void
  selectDeliveryOption: (option: string) => void
  numberOfItems: number
  numberOfUnavailableItems: number
}

export const ShippingResult: FC<CustomProps> = ({
  address,
  canEditData,
  options,
  setShowResult,
  selectDeliveryOption,
  numberOfItems,
  numberOfUnavailableItems,
}) => {
  const { postalCode } = removeValidation(address)

  return (
    <Fragment>
      <div className="mb4 flex items-center">
        <div id="postal-code" className="flex-auto">
          <span className="fw5">Options for</span> {postalCode}
        </div>
        {canEditData && (
          <div className="flex-none">
            <Button id="edit-shipping" onClick={() => setShowResult(false)}>
              edit
            </Button>
          </div>
        )}
      </div>
      <ShippingOptions
        numberOfItems={numberOfItems}
        numberOfUnavailableItems={numberOfUnavailableItems}
        options={options}
        selectDeliveryOption={selectDeliveryOption}
      />
    </Fragment>
  )
}
