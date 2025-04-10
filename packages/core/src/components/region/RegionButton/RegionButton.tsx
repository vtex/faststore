import { Button as UIButton } from '@faststore/ui'

import { Icon, useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'
import { stringToTitleCase } from 'src/utils/utilities'
import { session as initialSession } from 'discovery.config'

function RegionButton({ icon, label }: { icon: string; label: string }) {
  const { openModal } = useUI()
  const { city, postalCode } = useSession()
  const shouldDisplayPostalCode = postalCode !== initialSession.postalCode

  return (
    <UIButton
      variant="tertiary"
      size="small"
      icon={<Icon name={icon} width={18} height={18} weight="bold" />}
      iconPosition="left"
      onClick={openModal}
    >
      {city && postalCode
        ? `${stringToTitleCase(city)}${shouldDisplayPostalCode ? `, ${postalCode}` : ''}`
        : label}
    </UIButton>
  )
}

export default RegionButton
