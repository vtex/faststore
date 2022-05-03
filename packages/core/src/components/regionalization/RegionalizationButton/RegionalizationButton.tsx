import type { HTMLAttributes } from 'react'
import { useSession } from '@faststore/sdk'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { useModal } from 'src/sdk/ui/modal/Provider'

interface RegionalizationButtonProps extends HTMLAttributes<HTMLDivElement> {
  classes: string
}

export default function RegionalizationButton({
  classes,
  ...otherProps
}: RegionalizationButtonProps) {
  const { setIsRegionalizationModalOpen } = useModal()
  const { postalCode } = useSession()

  return (
    <div data-fs-regionalization-button className={classes} {...otherProps}>
      <Button
        variant="tertiary"
        size="small"
        icon={<Icon name="MapPin" width={24} height={24} />}
        iconPosition="left"
        onClick={() => setIsRegionalizationModalOpen(true)}
      >
        <span>{postalCode ?? 'Set your location'}</span>
      </Button>
    </div>
  )
}
