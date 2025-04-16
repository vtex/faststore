import { useEffect, useRef } from 'react'

import { Button as UIButton, Icon as UIIcon, useUI } from '@faststore/ui'
import { session as initialSession } from 'discovery.config'
import { useSession } from 'src/sdk/session'
import { textToTitleCase } from 'src/utils/utilities'

import { useRegionModal } from '../RegionModal/useRegionModal'

function RegionButton({ icon, label }: { icon: string; label: string }) {
  const { openModal, openPopover } = useUI()
  const { city, postalCode } = useSession()
  const { isValidationComplete } = useRegionModal()

  const defaultPostalCode =
    postalCode === initialSession.postalCode &&
    initialSession.postalCode !== null

  const buttonRef = useRef<HTMLButtonElement>(null)

  // Call openPopover if defaultPostalCode is true
  useEffect(() => {
    if (isValidationComplete && defaultPostalCode) {
      openPopover({
        isOpen: true,
        triggerRef: buttonRef,
      })
    }
  }, [isValidationComplete, defaultPostalCode, openPopover])

  return (
    <>
      <UIButton
        variant="tertiary"
        size="small"
        icon={<UIIcon name={icon} width={18} height={18} weight="bold" />}
        iconPosition="left"
        onClick={openModal}
        ref={buttonRef}
      >
        {city && postalCode ? `${textToTitleCase(city)}, ${postalCode}` : label}
      </UIButton>
    </>
  )
}

export default RegionButton
