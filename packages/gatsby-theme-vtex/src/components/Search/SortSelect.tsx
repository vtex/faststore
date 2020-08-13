import React, { FC } from 'react'
import { SortSelect as StoreUISearchSelect } from '@vtex/store-ui'

import { useSearchFilters } from '../../hooks/useSearchFilters'

interface Props {
  variant: string
}

const SortSelect: FC<Props> = ({ variant }) => {
  const filters = useSearchFilters()

  return (
    <StoreUISearchSelect
      variant={variant}
      onChange={(value: string) => {
        console.log(value)
      }}
    />
  )
}

export default SortSelect
