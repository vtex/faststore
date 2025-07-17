import type { HTMLAttributes, ReactNode, RefAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Button } from '../../'

export interface RegionBarProps
  extends HTMLAttributes<HTMLDivElement>,
    RefAttributes<HTMLDivElement> {
  /**
   * City to be displayed in the component.
   */
  city?: string
  /**
   * Postal code string to be display in the component.
   */
  postalCode?: string
  /**
   * Function called when location button is clicked.
   */
  onButtonClick?: () => void
  /**
   * A React component that will be rendered as the location icon.
   */
  icon?: ReactNode
  /**
   * Specifies a label for the location text.
   */
  label: string
  /**
   * Specifies a label for the edit location text.
   * @deprecated
   */
  editLabel?: string
  /**
   * A React component that will be rendered as an icon.
   */
  buttonIcon?: ReactNode
  /**
   * Boolean to control whether postal code should be visible or not.
   * @default true
   */
  shouldDisplayPostalCode?: boolean
  /**
   * Properties of the global filter button.
   */
  filterButton?: {
    /**
     * A React component that will be rendered as the filter icon.
     */
    icon?: ReactNode
    /**
     * Specifies a label for the filter text.
     */
    label?: string
    /**
     * The current selected filter name.
     */
    selectedFilter?: string
    /**
     * Boolean to control whether the filter button should be visible or not.
     * @default false
     */
    shouldDisplayFilterButton?: boolean
    /**
     * Function called when filter button is clicked.
     */
    onClick?: () => void
  }
}

const RegionBar = forwardRef<HTMLDivElement, RegionBarProps>(function RegionBar(
  {
    city,
    postalCode,
    icon: locationIcon,
    label: locationLabel,
    editLabel: _ = undefined,
    buttonIcon,
    onButtonClick: onLocationButtonClick,
    shouldDisplayPostalCode = true,
    filterButton: {
      icon: filterIcon,
      label: filterLabel,
      selectedFilter,
      shouldDisplayFilterButton = false,
      onClick: onFilterButtonClick,
    } = {},
    ...otherProps
  },
  ref
) {
  return (
    <div ref={ref} data-fs-region-bar {...otherProps}>
      <Button
        variant="tertiary"
        iconPosition={buttonIcon ? 'right' : undefined}
        onClick={onLocationButtonClick}
        icon={buttonIcon ?? undefined}
      >
        {!!locationIcon && locationIcon}
        {city && postalCode ? (
          <div data-fs-region-bar-location>
            <span
              data-fs-region-bar-postal-code
              data-fs-region-bar-location-city
            >
              {city}
            </span>
            <span data-fs-region-bar-location-postal-code>
              {shouldDisplayPostalCode && `, ${postalCode}`}
            </span>
          </div>
        ) : (
          <span data-fs-region-bar-message data-fs-region-bar-location-message>
            {locationLabel}
          </span>
        )}
      </Button>
      {shouldDisplayFilterButton && (
        <Button
          variant="tertiary"
          iconPosition={buttonIcon ? 'right' : undefined}
          onClick={onFilterButtonClick}
          icon={buttonIcon ?? undefined}
        >
          {!!filterIcon && filterIcon}
          {selectedFilter ? (
            <span data-fs-region-bar-filter>{selectedFilter}</span>
          ) : (
            <span data-fs-region-bar-filter-message>{filterLabel}</span>
          )}
        </Button>
      )}
    </div>
  )
})

export default RegionBar
