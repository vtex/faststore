import { useEffect, useRef } from 'react'

import { Button as UIButton, Icon as UIIcon, useUI } from '@faststore/ui'
import { session as initialSession } from 'discovery.config'
import { useSession } from 'src/sdk/session'
import { textToTitleCase } from 'src/utils/utilities'

function RegionButton({ icon, label }: { icon: string; label: string }) {
  const { openModal, openPopover } = useUI()
  const { city, postalCode } = useSession()

  console.log(postalCode)

  const defaultPostalCode = postalCode === initialSession.postalCode

  const buttonRef = useRef<HTMLButtonElement>(null)

  // Call openPopover if defaultPostalCode is true
  useEffect(() => {
    if (defaultPostalCode && buttonRef) {
      openPopover({
        isOpen: true,
        triggerRef: buttonRef,
      })
    }
  }, [defaultPostalCode, openPopover])

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
