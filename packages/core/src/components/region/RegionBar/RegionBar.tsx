import type { RegionBarProps as UIRegionBarProps } from '@faststore/ui'
import { useEffect, useRef } from 'react'

import { regionSliderTypes, useUI } from '@faststore/ui'
import { sessionStore, useSession } from 'src/sdk/session'
import { useDeliveryPromise } from 'src/sdk/deliveryPromise'

import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { textToTitleCase } from 'src/utils/utilities'
import { getGlobalSettings } from 'src/utils/globalSettings'
import { useCheckRegionState } from 'src/sdk/userLocation'

import { deliveryPromise } from 'discovery.config'
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

  const { city, postalCode } = useSession()
  const regionBarRef = useRef<HTMLDivElement>(null)
  const { openPopover, openRegionSlider } = useUI()
  const { openModal } = useCheckRegionState(regionBarRef)
  const { globalPickupPoint } = useDeliveryPromise()
  const {
    deliveryPromise: { filterByPickupPoint } = {},
  } = getGlobalSettings()
  const initialSession = sessionStore.readInitial()

  const shouldDisplayGlobalFilter =
    deliveryPromise.enabled && !!postalCode && filterByPickupPoint?.enabled

  useEffect(() => {
    if (!deliveryPromise.enabled) {
      return
    }

    const defaultPostalCode =
      !!initialSession?.postalCode && postalCode === initialSession.postalCode

    // If location is not mandatory, and default zipCode is provided or if the user has not set a zipCode, show the popover.
    const displayRegionPopover =
      defaultPostalCode || (!postalCode && !deliveryPromise.mandatory)

    if (displayRegionPopover && regionBarRef.current) {
      openPopover({
        isOpen: true,
        triggerRef: regionBarRef,
      })
    }
  }, [])

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
        selectedFilter:
          (globalPickupPoint?.name || globalPickupPoint?.address?.street) ??
          undefined,
        shouldDisplayFilterButton: shouldDisplayGlobalFilter,
        onClick: () =>
          openRegionSlider(regionSliderTypes.globalChangePickupPoint),
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
