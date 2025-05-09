import type { RegionBarProps as UIRegionBarProps } from '@faststore/ui'
import { useEffect, useRef } from 'react'

import { useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'

import { deliveryPromise, session as initialSession } from 'discovery.config'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { textToTitleCase } from 'src/utils/utilities'

import { useRegionModal } from '../RegionModal/useRegionModal'

export interface RegionBarProps {
  /**
   * A React component that will be rendered as an icon.
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
  buttonIcon: { icon: buttonIcon, alt: buttonIconAlt },
  label,
  editLabel,
  ...otherProps
}: RegionBarProps) {
  const {
    RegionBar: RegionBarWrapper,
    LocationIcon,
    ButtonIcon,
  } = useOverrideComponents<'RegionBar'>()

  const { openModal, openPopover } = useUI()
  const { city, postalCode } = useSession()
  const { isValidationComplete } = useRegionModal()
  const regionBarRef = useRef<HTMLDivElement>(null)

  const defaultPostalCode =
    !!initialSession?.postalCode && postalCode === initialSession.postalCode

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
        <ButtonIcon.Component
          {...ButtonIcon.props}
          name={buttonIcon ?? ButtonIcon.props.name}
          aria-label={buttonIconAlt ?? ButtonIcon.props['aria-label']}
        />
      }
      {...RegionBarWrapper.props}
      label={label ?? RegionBarWrapper.props.label}
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
