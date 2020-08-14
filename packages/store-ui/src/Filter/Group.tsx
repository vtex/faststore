import Accordion from '@vtex-components/accordion'
import React, { FC } from 'react'

import { FilterSelector, Value } from './Selector'
import { GroupCollapsibleIcon } from './GroupCollapsibleIcon'

interface Props {
  filters: Array<{
    name: string
    values: Value[]
  }>
  variant: string
  isActive: boolean
  renderItem: (facet: Value, variant: string) => JSX.Element
  renderIcon?: ((isActive: boolean) => React.ReactNode) | null
}

export const FilterGroup: FC<Props> = ({
  filters,
  variant,
  isActive,
  renderItem,
  renderIcon,
}) => {
  const defaultRenderIcon = (active: boolean) => (
    <GroupCollapsibleIcon
      isActive={active}
      variant={`${variant}.accordion.collapsible.header.icon`}
    />
  )

  return (
    <Accordion
      variant={variant}
      mode="multiOpen"
      renderIcon={renderIcon ?? defaultRenderIcon}
    >
      {filters.map((filter) => (
        <Accordion.Section
          key={filter.name}
          header={filter.name}
          isActive={isActive}
        >
          <FilterSelector
            name={filter.name}
            values={filter.values}
            variant={`${variant}.accordion.collapsible`}
            renderItem={renderItem}
          />
        </Accordion.Section>
      ))}
    </Accordion>
  )
}
