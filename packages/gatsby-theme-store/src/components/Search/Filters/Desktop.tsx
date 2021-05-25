import {
  Box,
  SearchFilterAccordion,
  SearchFilterAccordionItemCheckbox,
  SearchFilterAccordionItemSlider,
} from '@vtex/store-ui'
import { FormattedMessage } from '@vtex/gatsby-plugin-i18n'
import React, { Fragment } from 'react'
import type { FC } from 'react'

import { useNumberFormat } from '../../../sdk/localization/useNumberFormat'
import { useSearch } from '../../../sdk/search/useSearch'
import { priceRange } from '../../../sdk/search/converter/priceRange'

export interface Props {
  variant?: string
  isActive?: boolean | ((index: number) => boolean)
}

const SearchFilters: FC<Props> = ({ variant = 'desktop', isActive = true }) => {
  const { format } = useNumberFormat()
  const {
    toggleFacet,
    setFacet,
    searchParams: { selectedFacets },
    data: {
      vtex: { facets },
    },
  } = useSearch()

  return (
    <Fragment>
      <Box variant={`searchFilter.${variant}.title`}>
        <FormattedMessage id="facets.filters" />
      </Box>

      <SearchFilterAccordion
        filters={facets!.facets! as any}
        isActive={isActive}
        variant={variant}
        renderFilter={(item, v: string) => (
          <SearchFilterAccordionItemCheckbox
            onClick={toggleFacet}
            item={item}
            variant={v}
          />
        )}
        renderPrice={(filter) => {
          const range = priceRange.parseUrl(
            selectedFacets.find((x) => x.key === 'priceRange')?.value ?? ''
          )

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
                setFacet({
                  key: 'priceRange',
                  value: priceRange.formatUrl({ from, to }),
                  unique: true,
                })
              }}
              range={{
                min,
                max,
              }}
              cursor={{
                left: range?.from ?? min,
                right: range?.to ?? max,
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
