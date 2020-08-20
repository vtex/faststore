import BaseAccordion from '@vtex-components/accordion'
import React, { FC, useCallback } from 'react'
import { Box } from 'theme-ui'

import { Item } from './AccordionItemCheckbox'
import { SearchFilterAccordionCollaipsibleIcon } from './AccordionCollapsibleIcon'

export type SearchFilterItem = Item

interface Filter {
  name: string
  values: SearchFilterItem[]
}

interface Props {
  filters: Filter[]
  variant: string
  isActive: boolean
  renderItem: (facet: SearchFilterItem, variant: string) => JSX.Element
  renderIcon?: ((isActive: boolean) => React.ReactNode) | null
}

export const SearchFilterAccordion: FC<Props> = ({
  filters,
  variant: v,
  isActive,
  renderItem,
  renderIcon,
}) => {
  const variant = `searchFilter.${v}`
  const defaultRenderIcon = useCallback(
    (active: boolean) => (
      <SearchFilterAccordionCollaipsibleIcon
        isActive={active}
        variant={`${variant}.accordion.collapsible.header`}
      />
    ),
    [variant]
  )

  return (
    <BaseAccordion
      variant={variant}
      mode="multiOpen"
      renderIcon={renderIcon ?? defaultRenderIcon}
    >
      {filters.map((filter) => (
        <BaseAccordion.Section
          key={filter.name}
          header={filter.name}
          isActive={isActive}
          onClick={() => {debugger; console.log('accordion clicked')}}
        >
          <Box as="ul" variant={`${variant}.accordion.collapsible.ul`}>
            {filter.values.map((item, index) => (
              <li key={`${filter.name}:${index}`}>
                {renderItem(item, `${variant}.accordion.collapsible.li`)}
              </li>
            ))}
          </Box>
        </BaseAccordion.Section>
      ))}
    </BaseAccordion>
  )
}
