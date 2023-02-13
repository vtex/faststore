import { Price as UIPrice, SROnly as UISROnly } from '@faststore/ui'
import { memo } from 'react'
import type { PriceProps } from '@faststore/ui'

import styles from './price.module.scss'

type Props = PriceProps & {
  /**
   * Text for the screen readers only
   */
  SRText: string
  /**
   * Other classes that might be applied
   */
  classes?: string
}

function Price({ classes = '', SRText, ...props }: Props) {
  return (
    <>
      <UISROnly text={SRText} />
      <UIPrice
        data-fs-price
        className={`${styles.fsPrice} ${classes}`}
        {...props}
      />
    </>
  )
}

export default memo(Price)
