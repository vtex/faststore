import {
  Box,
  SearchFilterAccordion,
  SearchFilterAccordionItemCheckbox,
  SearchFilterAccordionItemSlider,
} from '@vtex/store-ui'
import { FormattedMessage } from '@vtex/gatsby-plugin-i18n'
import React, { Fragment } from 'react'
import type { FC } from 'react'

import { useFacets } from '../../../sdk/search/useFacets'
import { useNumberFormat } from '../../../sdk/localization/useNumberFormat'
import { useFilters } from '../../../sdk/search/useFilters'

export interface Props {
  variant?: string
  isActive?: boolean | ((index: number) => boolean)
}

const SearchFilters: FC<Props> = ({ variant = 'desktop', isActive = true }) => {
  const { facets, toggleItem, setPriceRange } = useFacets()
  const { priceRange } = useFilters()
  const { format } = useNumberFormat()

  return (
    <Fragment>
      <Box variant={`searchFilter.${variant}.title`}>
        <FormattedMessage id="facets.filters" />
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
        renderPrice={(filter) => {
          let min = Infinity
          let max = 0

          /**
           * TODO: This should be moved to the back-end since there is no
           * reason for making this reduce in the frontend
           */
          for (const {
            range: { from, to },
          } of filter.values) {
            if (from < min) {
              min = from
            }

            if (to > max) {
              max = to
            }
          }

          return (
            <SearchFilterAccordionItemSlider
              onChange={({ min: from, max: to }) => {
                setPriceRange({ from, to: to! })
              }}
              range={{
                min,
                max,
              }}
              cursor={{
                left: priceRange?.from ?? min,
                right: priceRange?.to ?? max,
              }}
              formatValue={format}
              disabled={false}
              displayPopup
            />
          )
        }}
      />
    </Fragment>
  )
}

export default SearchFilters
