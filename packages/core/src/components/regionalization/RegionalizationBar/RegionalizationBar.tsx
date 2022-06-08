import { useSession } from '@faststore/sdk'
import type { HTMLAttributes } from 'react'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { useUI } from 'src/sdk/ui/Provider'

interface Props extends HTMLAttributes<HTMLDivElement> {
  classes: string
}

function RegionBar({ classes, ...otherProps }: Props) {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <div data-fs-regionalization-bar className={classes} {...otherProps}>
      <Button onClick={openModal}>
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

export default RegionBar
