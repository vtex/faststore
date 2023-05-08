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
      icon={<Icon name="MapPin" width={18} height={18} weight="bold" />}
      iconPosition="left"
      onClick={openModal}
    >
      {postalCode ?? 'Set your location'}
    </UIButton>
  )
}

export default RegionButton
