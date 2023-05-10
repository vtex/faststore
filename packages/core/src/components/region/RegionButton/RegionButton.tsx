import { Button as UIButton } from '@faststore/ui'

import { Icon, useUI } from '@faststore/ui'
import { useSession } from 'src/sdk/session'

function RegionButton({ icon, label }: { icon: string; label: string }) {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <UIButton
      variant="tertiary"
      size="small"
      icon={<Icon name={icon} width={18} height={18} weight="bold" />}
      iconPosition="left"
      onClick={openModal}
    >
      {postalCode ?? label}
    </UIButton>
  )
}

export default RegionButton
