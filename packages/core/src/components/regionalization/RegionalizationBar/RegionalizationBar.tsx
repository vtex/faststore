import type { HTMLAttributes } from 'react'
import { useSession } from '@faststore/sdk'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { useModal } from 'src/sdk/ui/modal/Provider'

interface RegionalizationBarProps extends HTMLAttributes<HTMLDivElement> {
  classes: string
}

export default function RegionalizationBar({
  classes,
  ...otherProps
}: RegionalizationBarProps) {
  const { setIsRegionalizationModalOpen } = useModal()
  const { postalCode } = useSession()

  return (
    <div data-fs-regionalization-bar className={classes} {...otherProps}>
      <Button onClick={() => setIsRegionalizationModalOpen(true)}>
        <Icon name="MapPin" width={24} height={24} />
        {postalCode ? (
          <>
            <span>{postalCode}</span>
            <span>Edit</span>
          </>
        ) : (
          <span>Set your location</span>
        )}
        <Icon name="CaretRight" width={24} height={24} />
      </Button>
    </div>
  )
}
