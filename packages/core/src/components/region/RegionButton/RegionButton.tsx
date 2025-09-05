import { useRef } from 'react'

import { Button as UIButton, Icon as UIIcon } from '@faststore/ui'
import { useSession } from 'src/sdk/session'
import { textToTitleCase } from 'src/utils/utilities'
import { useCheckRegionState } from 'src/sdk/userLocation'

function RegionButton({ icon, label }: { icon: string; label: string }) {
  const { city, postalCode } = useSession()
  const regionButtonRef = useRef<HTMLButtonElement>(null)
  const { openModal } = useCheckRegionState(regionButtonRef)

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
