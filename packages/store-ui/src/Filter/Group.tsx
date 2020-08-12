import Accordion from '@vtex-components/accordion'
import React, { FC } from 'react'

import FilterSelector, { Value } from './Selector'
import GroupCollapsibleIcon from './GroupCollapsibleIcon'

interface Props {
  filters: Array<{
    name: string
    values: Value[]
  }>
  variant: string
  renderItem: (facet: Value, variant: string) => JSX.Element
  renderIcon?: ((isActive: boolean) => React.ReactNode) | null
}

const FilterGroup: FC<Props> = ({
  filters,
  variant,
  renderItem,
  renderIcon = (isActive) => <GroupCollapsibleIcon isActive={isActive} />,
}) => {
  return (
    <Accordion prefix={variant} mode="multiOpen" renderIcon={renderIcon as any}>
      {filters.map((filter) => (
        <Accordion.Section
          key={filter.name}
          header={filter.name}
          prefix={variant}
        >
          <FilterSelector
            name={filter.name}
            values={filter.values}
            variant={variant}
            renderItem={renderItem}
          />
        </Accordion.Section>
      ))}
    </Accordion>
  )
}

export default FilterGroup
