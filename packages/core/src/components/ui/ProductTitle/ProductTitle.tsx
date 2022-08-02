import { memo } from 'react'
import type { ProductTitleProps } from '@faststore/ui'
import { ProductTitle as UIProductTitle } from '@faststore/ui'

import styles from './product-title.module.scss'

function ProductTitle({ ...otherProps }: ProductTitleProps) {
  return <UIProductTitle className={styles.fsProductTitle} {...otherProps} />
}

export default memo(ProductTitle)
