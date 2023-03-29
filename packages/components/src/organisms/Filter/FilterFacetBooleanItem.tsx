import React from 'react'
import { Badge, Checkbox, Label } from '../..'
import { OnFacetChange } from './Filter'

export interface FilterFacetBooleanItemProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId: string
  /**
   * The text displayed to identify the Boolean Facet Item.
   */
  label: string
  /**
   * Value to be emitted when Checkbox is clicked.
   */
  value: string
  /**
   * Boolean that represents the Checkbox checked state.
   */
  selected: boolean
  /**
   * Counter badge shown besides the Facet Item.
   */
  quantity: number
  /**
   * ID to identify the Checkbox and corresponding label.
   */
  id: string
  /**
   * String that identifies the current Facet key.
   */
  facetKey: string
  /**
   * This function is called when `Checkbox` from the facet changes.
   */
  onFacetChange: OnFacetChange
}

function FilterFacetBooleanItem({
  testId,
  id,
  selected,
  value,
  quantity,
  facetKey,
  label,
  onFacetChange,
}: FilterFacetBooleanItemProps) {
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

export default FilterFacetBooleanItem
