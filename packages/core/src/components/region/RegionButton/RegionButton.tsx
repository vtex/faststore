import { Button as UIButton } from '@faststore/ui'

import Icon from 'src/components/ui/Icon'
import { useSession } from 'src/sdk/session'
import { useUI } from '@faststore/ui'

function RegionButton() {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <UIButton
      data-fs-regionalization-button
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
