import type { RegionBarProps as UIRegionBarProps } from '@faststore/ui'
import { useEffect, useRef } from 'react'

import { useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'

import { deliveryPromise, session as initialSession } from 'discovery.config'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { textToTitleCase } from 'src/utils/utilities'
import { getRegionalizationSettings } from 'src/utils/globalSettings'

import { useRegionModal } from '../RegionModal/useRegionModal'

export interface RegionBarProps {
  /**
   * A React component that will be rendered as the location icon.
   */
  icon?: {
    icon: string
    alt: string
  }
  /**
   * Specifies a label for the location text.
   */
  label: UIRegionBarProps['label']
  /**
   * Specifies a label for the edit text.
   * @deprecated
   */
  editLabel?: UIRegionBarProps['editLabel']
  /**
   * A React component that will be rendered as an icon.
   */
  buttonIcon?: {
    icon: string
    alt: string
  }
}

function RegionBar({
  icon: { icon: locationIcon, alt: locationIconAlt },
  buttonIcon = undefined,
  label: locationLabel,
  editLabel = undefined,
  ...otherProps
}: RegionBarProps) {
  const {
    RegionBar: RegionBarWrapper,
    LocationIcon,
    ButtonIcon,
    FilterButtonIcon,
  } = useOverrideComponents<'RegionBar'>()

  const { openModal, openPopover } = useUI()
  const { city, postalCode } = useSession()
  const { isValidationComplete } = useRegionModal()
  const { filterByPickupPoint } = getRegionalizationSettings()
  const regionBarRef = useRef<HTMLDivElement>(null)

  const defaultPostalCode =
    !!initialSession?.postalCode && postalCode === initialSession.postalCode
  const shouldDisplayGlobalFilter =
    deliveryPromise.enabled && !!postalCode && filterByPickupPoint?.enabled

  // If location is not mandatory, and default zipCode is provided or if the user has not set a zipCode, show the popover.
  const displayRegionPopover =
    defaultPostalCode || (!postalCode && !deliveryPromise.mandatory)

  useEffect(() => {
    if (!deliveryPromise.enabled) {
      return
    }

    if (!isValidationComplete) {
      return
    }

    if (isValidationComplete && displayRegionPopover && regionBarRef.current) {
      openPopover({
        isOpen: true,
        triggerRef: regionBarRef,
      })
    }
  }, [isValidationComplete])

  return (
    <RegionBarWrapper.Component
      icon={
        <LocationIcon.Component
          {...LocationIcon.props}
          name={locationIcon ?? LocationIcon.props.name}
          aria-label={locationIconAlt ?? LocationIcon.props['aria-label']}
        />
      }
      buttonIcon={
        buttonIcon?.icon ? (
          <ButtonIcon.Component
            {...ButtonIcon.props}
            name={buttonIcon?.icon ?? ButtonIcon.props.name}
            aria-label={buttonIcon?.alt ?? ButtonIcon.props['aria-label']}
          />
        ) : undefined
      }
      filterButton={{
        label: filterByPickupPoint?.label,
        icon: (
          <FilterButtonIcon.Component
            {...FilterButtonIcon.props}
            name={
              filterByPickupPoint?.icon?.icon ?? FilterButtonIcon.props.name
            }
            aria-label={
              filterByPickupPoint?.icon?.alt ??
              FilterButtonIcon.props['aria-label']
            }
          />
        ),
        selectedFilter: undefined, // TODO: specify selected pickup point
        shouldDisplayFilterButton: shouldDisplayGlobalFilter,
        onClick: () => console.log('TODO: open RegionSlider'),
      }}
      {...RegionBarWrapper.props}
      label={locationLabel ?? RegionBarWrapper.props.label}
      editLabel={editLabel ?? RegionBarWrapper.props.editLabel}
      // Dynamic props shouldn't be overridable
      // This decision can be reviewed later if needed
      onButtonClick={openModal}
      postalCode={postalCode}
      city={textToTitleCase(city ?? '')}
      {...otherProps}
      ref={regionBarRef}
    />
  )
}

export default RegionBar
