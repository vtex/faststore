import { Price as UIPrice } from '@faststore/ui'
import { memo } from 'react'
import type { PriceProps } from '@faststore/ui'

import SROnly from '../SROnly'

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

function Price({ classes, SRText, ...props }: Props) {
  return (
    <>
      <SROnly text={SRText} />
      <UIPrice className={`price ${classes}`} {...props} />
    </>
  )
}

export default memo(Price)
