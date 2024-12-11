import React from 'react'
import type { ProductComparisonProps as UIProductComparisonProps } from '@faststore/ui'

import { ProductComparison as UIProductComparison } from '@faststore/ui'

interface ProductComparisonProps extends UIProductComparisonProps {}

function ProductComparison(props: ProductComparisonProps) {
  return <UIProductComparison {...props} />
}

export default ProductComparison
