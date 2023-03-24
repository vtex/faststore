import React from 'react'
import { Badge, Checkbox, Label } from '../../'
import { OnFacetChange } from './Filter'

export type FacetBooleanItemProps = {
  testId: string
  /**
   * This function is called when `Checkbox` from the facet changes.
   */
  onFacetChange: OnFacetChange
  label: string
  value: string
  selected: boolean
  quantity: number
  id: string
  facetKey: string
}

function FacetBooleanItem({
  id,
  testId,
  onFacetChange,
  selected,
  value,
  quantity,
  facetKey,
  label,
}: FacetBooleanItemProps) {
  return (
    <li key={id} data-fs-filter-list-item>
      <Checkbox
        id={id}
        checked={selected}
        onChange={() => onFacetChange({ key: facetKey, value }, 'BOOLEAN')}
        data-fs-filter-list-item-checkbox
        data-testid={`${testId}-accordion-panel-checkbox`}
        data-value={value}
        data-quantity={quantity}
      />
      <Label
        htmlFor={id}
        className="text__title-mini-alt"
        data-fs-filter-list-item-label
      >
        {label} <Badge data-fs-filter-list-item-badge>{quantity}</Badge>
      </Label>
    </li>
  )
}

export default FacetBooleanItem
