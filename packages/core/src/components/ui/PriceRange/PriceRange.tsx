import { PriceRange as UIPriceRange } from '@faststore/ui'
import type { PriceRangeProps } from '@faststore/ui'

import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import styles from './price-range.module.scss'

type Props = Omit<PriceRangeProps, 'formatter'>

function PriceRange(props: Props) {
  const formatter = usePriceFormatter()

  return (
    <UIPriceRange
      data-fs-price-range
      className={styles.fsPriceRange}
      formatter={formatter}
      {...props}
    />
  )
}

export default PriceRange
