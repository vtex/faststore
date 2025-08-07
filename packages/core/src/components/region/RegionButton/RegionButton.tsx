import { useEffect, useRef } from 'react'

import { Button as UIButton, Icon as UIIcon, useUI } from '@faststore/ui'
import { deliveryPromise, session as initialSession } from 'discovery.config'
import { useSession } from 'src/sdk/session'
import { textToTitleCase } from '../../../utils/utilities'

import { useRegionModal } from '../RegionModal/useRegionModal'

function RegionButton({ icon, label }: { icon: string; label: string }) {
  const { openModal, openPopover } = useUI()
  const { city, postalCode } = useSession()
  const { isValidationComplete } = useRegionModal()
  const regionButtonRef = useRef<HTMLButtonElement>(null)

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

    if (
      isValidationComplete &&
      displayRegionPopover &&
      regionButtonRef.current
    ) {
      openPopover({
        isOpen: true,
        triggerRef: regionButtonRef,
      })
    }
  }, [isValidationComplete])

  return (
    <UIButton
      variant="tertiary"
      size="small"
      icon={<UIIcon name={icon} width={18} height={18} weight="bold" />}
      iconPosition="left"
      onClick={openModal}
      ref={regionButtonRef}
    >
      {city && postalCode ? `${textToTitleCase(city)}, ${postalCode}` : label}
    </UIButton>
  )
}

export default RegionButton
