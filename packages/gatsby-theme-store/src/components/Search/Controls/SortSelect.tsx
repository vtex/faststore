import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { SearchControlsSelect as StoreUISortSelect } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import { useSearch } from '../../../sdk/search/useSearch'

interface Props {
  variant?: string
}

const SearchControlsSelect: FC<Props> = ({ variant }) => {
  const { formatMessage } = useIntl()
  const {
    setSort,
    searchParams: { sort },
  } = useSearch()

  return (
    <StoreUISortSelect
      variant={variant}
      defaultValue={sort}
      onChange={setSort as any}
      formatLabel={(label: string) => formatMessage({ id: label })}
    />
  )
}

export default SearchControlsSelect
