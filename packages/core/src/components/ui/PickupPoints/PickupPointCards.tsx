import {
  EmptyState as UIEmptyState,
  Icon as UIIcon,
  List as UIList,
  RadioGroup as UIRadioGroup,
  RadioOption as UIRadioOption,
} from '@vtex/faststore-ui'
import type { ChangeEventHandler, MouseEventHandler } from 'react'
import type { PickupPoint } from '../../../sdk/deliveryPromise'
import { PickupPointCard } from '.'

export interface PickupPointCardsProps {
  /**
   * Selected option value.
   */
  selectedOption?: string
  /**
   * Function that is triggered when any option is selected.
   */
  onChange?: MouseEventHandler<HTMLInputElement> &
    ChangeEventHandler<HTMLInputElement>
  /**
   * Message to be displayed when no pickup points are available.
   */
  noPickupPointsAvailableMessage?: string
  /**
   * Message to be displayed when there is an error when setting the location.
   */
  errorMessage?: {
    title?: string
    description?: string
  }
  /**
   * Aria label for the radio group.
   */
  choosePickupPointAriaLabel?: string
  /**
   * List of pickup points to be displayed.
   */
  pickupPoints: PickupPoint[]
}

function PickupPointCards({
  pickupPoints,
  selectedOption,
  onChange,
  noPickupPointsAvailableMessage,
  errorMessage: {
    title: regionErrorMessage,
    description: regionErrorHelperMessage,
  },
  choosePickupPointAriaLabel = 'Select a store',
}: PickupPointCardsProps) {
  if (regionErrorMessage) {
    return (
      <UIEmptyState
        title={regionErrorMessage ?? ''}
        titleIcon={
          <UIIcon name="MapPin" width={56} height={56} weight="thin" />
        }
        bkgColor="light"
      >
        <p>{regionErrorHelperMessage}</p>
      </UIEmptyState>
    )
  }

  if (noPickupPointsAvailableMessage) {
    return (
      <UIEmptyState
        title={
          noPickupPointsAvailableMessage ?? 'No available stores near location.'
        }
        titleIcon={
          <UIIcon name="Storefront" width={56} height={56} weight="thin" />
        }
        bkgColor="light"
      />
    )
  }

  return (
    <UIList as="ol" data-fs-pickup-point-cards>
      <UIRadioGroup
        name="stores-radio-group"
        selectedValue={selectedOption}
        onChange={onChange}
        aria-label={choosePickupPointAriaLabel}
      >
        {pickupPoints?.map((item) => (
          <li data-fs-pickup-point-cards-item key={item.id}>
            <UIRadioOption value={item.id} label={item.name} onClick={onChange}>
              <PickupPointCard store={item} />
            </UIRadioOption>
          </li>
        ))}
      </UIRadioGroup>
    </UIList>
  )
}

export default PickupPointCards
