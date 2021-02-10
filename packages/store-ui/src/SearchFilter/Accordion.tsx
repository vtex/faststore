import BaseAccordion from '@vtex-components/accordion'
import React, { useCallback } from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

import { SearchFilterAccordionCollapsibleIcon } from './AccordionCollapsibleIcon'
import type { Item } from './AccordionItemCheckbox'

export type SearchFilterItem = Item

interface Filter {
  name: string
  type: string
  values: SearchFilterItem[]
}

interface Props {
  filters: Filter[]
  variant: string
  isActive: boolean | ((index: number) => boolean)
  renderPrice: (facet: Filter, variant: string) => JSX.Element
  renderFilter: (facet: SearchFilterItem, variant: string) => JSX.Element
  renderIcon?: ((isActive: boolean) => React.ReactNode) | null
}

const SearchFilterAccordion: FC<Props> = ({
  filters,
  variant: v,
  isActive,
  renderFilter,
  renderPrice,
  renderIcon,
}) => {
  const variant = `searchFilter.${v}`
  const defaultRenderIcon = useCallback(
    (active: boolean) => (
      <SearchFilterAccordionCollapsibleIcon
        isActive={active}
        variant={`${variant}.accordion.collapsible.header`}
      />
    ),
    [variant]
  )

  // Making this if in here helps performance because we have branchless maps later on
  const isActiveFn = typeof isActive === 'function' ? isActive : () => isActive

  return (
    <BaseAccordion
      data-testid="accordion"
      variant={variant}
      mode="multiOpen"
      renderIcon={renderIcon ?? defaultRenderIcon}
    >
      {filters.map((filter, index) => (
        <BaseAccordion.Section
          key={`${filter.name}:${index}`}
          header={filter.name}
          isActive={isActiveFn(index)}
        >
          {filter.type === 'PRICERANGE' ? (
            <Box variant={`${variant}.accordion.collapsible.price`}>
              {renderPrice(filter, variant)}
            </Box>
          ) : (
            <Box as="ul" variant={`${variant}.accordion.collapsible.ul`}>
              {filter.values.map((item, idx) => (
                <li key={`${filter.name}:${idx}`}>
                  {renderFilter(item, `${variant}.accordion.collapsible.li`)}
                </li>
              ))}
            </Box>
          )}
        </BaseAccordion.Section>
      ))}
    </BaseAccordion>
  )
}

export default SearchFilterAccordion
