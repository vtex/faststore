import { Button as UIButton } from '@faststore/ui'

import { Icon, useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'

function RegionButton() {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <UIButton
      variant="tertiary"
      size="small"
      icon={<Icon name="MapPin" width={24} height={24} />}
      iconPosition="left"
      onClick={openModal}
    >
      <span>{postalCode ?? 'Set your location'}</span>
    </UIButton>
  )
}

export default RegionButton
