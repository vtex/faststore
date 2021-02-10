/** @jsx jsx */
import {
  Box,
  SearchFilterAccordion,
  SearchFilterAccordionItemCheckbox,
  SearchFilterAccordionItemSlider,
  jsx,
} from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Fragment } from 'react'
import type { FC } from 'react'

import { useFacets } from '../../../sdk/search/useFacets'

export interface Props {
  variant?: string
  isActive?: boolean | ((index: number) => boolean)
}

const SearchFilters: FC<Props> = ({ variant = 'desktop', isActive = true }) => {
  const { facets, toggleItem, setPriceRange } = useFacets()
  const { formatMessage } = useIntl()

  const { search: searchParams } = window.location
  const params = new URLSearchParams(searchParams)

  const defaultValues = params
    .get('priceRange')
    ?.split(' TO ')
    .map((price) => parseInt(price, 10))

  return (
    <Fragment>
      <Box variant={`searchFilter.${variant}.title`}>
        {formatMessage({ id: 'facets.filters' })}
      </Box>

      <SearchFilterAccordion
        filters={facets}
        isActive={isActive}
        variant={variant}
        renderFilter={(item, v: string) => (
          <SearchFilterAccordionItemCheckbox
            onClick={toggleItem}
            item={item}
            variant={v}
          />
        )}
        renderPrice={() => (
          <SearchFilterAccordionItemSlider
            onChange={setPriceRange}
            min={0}
            max={1000}
            step={1}
            defaultValues={defaultValues ?? [0, 1000]}
            alwaysShowCurrentValue={false}
            formatValue={(a: number) => `R$${a},00`}
            range
          />
        )}
      />
    </Fragment>
  )
}

export default SearchFilters
