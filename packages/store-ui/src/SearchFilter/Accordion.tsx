import BaseAccordion from '@vtex-components/accordion'
import React, { useCallback } from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

import { SearchFilterAccordionCollaipsibleIcon } from './AccordionCollapsibleIcon'
import type { Item } from './AccordionItemCheckbox'
import Slider from './AccordionItemSlider'

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

  // Making this if in here helps performance because we have branchless maps later on
  const isActiveFn = typeof isActive === 'function' ? isActive : () => isActive

  return (
    <BaseAccordion
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
            <Box variant={`${variant}.accordion.collapsible.ul`}>
              <Slider
                onChange={() => {}}
                min={0}
                max={99}
                step={1}
                disabled={false}
                defaultValues={[0, 50]}
                alwaysShowCurrentValue={false}
                formatValue={(a: number) => a + 1}
                range
              />
            </Box>
          ) : (
            <Box as="ul" variant={`${variant}.accordion.collapsible.ul`}>
              {filter.values.map((item, idx) => (
                <li key={`${filter.name}:${idx}`}>
                  {renderItem(item, `${variant}.accordion.collapsible.li`)}
                </li>
              ))}
            </Box>
          )}
        </BaseAccordion.Section>
      ))}
    </BaseAccordion>
  )
}
