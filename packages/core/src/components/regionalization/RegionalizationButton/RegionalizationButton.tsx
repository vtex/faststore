import { useSession } from '@faststore/sdk'
import type { HTMLAttributes } from 'react'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { useUI } from 'src/sdk/ui/Provider'

interface Props extends HTMLAttributes<HTMLDivElement> {
  classes: string
}

function RegionButton({ classes, ...otherProps }: Props) {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <div data-fs-regionalization-button className={classes} {...otherProps}>
      <Button
        variant="tertiary"
        size="small"
        icon={<Icon name="MapPin" width={24} height={24} />}
        iconPosition="left"
        onClick={openModal}
      >
        <span>{postalCode ?? 'Set your location'}</span>
      </Button>
    </div>
  )
}

export default RegionButton
