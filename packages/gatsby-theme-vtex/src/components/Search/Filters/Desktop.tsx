/** @jsx jsx */
import {
  Box,
  SearchFilterAccordion,
  SearchFilterAccordionItemCheckbox,
  jsx,
} from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { FC, Fragment } from 'react'

import { useFacets } from '../../../sdk/search/useFacets'

export interface Props {
  variant?: string
  isActive?: boolean | ((index: number) => boolean)
}

const SearchFilters: FC<Props> = ({ variant = 'desktop', isActive = true }) => {
  const { facets, toggleItem } = useFacets()
  const { formatMessage } = useIntl()

  return (
    <Fragment>
      <Box variant={`searchFilter.${variant}.title`}>
        {formatMessage({ id: 'facets.filters' })}
      </Box>

      <SearchFilterAccordion
        filters={facets}
        isActive={isActive}
        variant={variant}
        renderItem={(item, v) => (
          <SearchFilterAccordionItemCheckbox
            onClick={toggleItem}
            item={item}
            variant={v}
          />
        )}
      />
    </Fragment>
  )
}

export default SearchFilters
