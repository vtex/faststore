import { useEffect, useRef, useState } from 'react'

import { Button as UIButton, Icon as UIIcon, useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'
import { textToTitleCase } from 'src/utils/utilities'
import { geolocationStore } from 'src/sdk/geolocation/useGeolocation'

function RegionButton({ icon, label }: { icon: string; label: string }) {
  const { openModal, openPopover } = useUI()
  const { city, postalCode } = useSession()
  const regionButtonRef = useRef<HTMLButtonElement>(null)
  const [popupState, setPopupState] = useState(
    geolocationStore.read().popupState
  )

  useEffect(() => {
    return geolocationStore.subscribe(({ popupState }) =>
      setPopupState(popupState)
    )
  }, [])

  useEffect(() => {
    if (popupState === 'open' && regionButtonRef) {
      openPopover({
        isOpen: true,
        triggerRef: regionButtonRef,
      })
    }
  }, [popupState, regionButtonRef])

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
