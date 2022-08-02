import type { HTMLAttributes } from 'react'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { useSession } from 'src/sdk/session'
import { useUI } from 'src/sdk/ui/Provider'

import styles from './regionalization-bar.module.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  classes: string
}

function RegionBar({ classes, ...otherProps }: Props) {
  const { openModal } = useUI()
  const { postalCode } = useSession()

  return (
    <div
      data-fs-regionalization-bar
      className={`${classes} ${styles.fsRegionalizationBar}`}
      {...otherProps}
    >
      <Button onClick={openModal}>
        <Icon name="MapPin" width={24} height={24} />
        {postalCode ? (
          <>
            <span data-fs-regionalization-bar-postal-code>{postalCode}</span>
            <span data-fs-regionalization-bar-cta>Edit</span>
          </>
        ) : (
          <span data-fs-regionalization-bar-message>Set your location</span>
        )}
        <Icon name="CaretRight" width={24} height={24} />
      </Button>
    </div>
  )
}

export default RegionBar
