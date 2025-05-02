import { setFacet, toggleFacet, useSearch } from '@faststore/sdk'

import {
  Button as UIButton,
  Filter as UIFilter,
  FilterFacetBoolean as UIFilterFacetBoolean,
  FilterFacetBooleanItem as UIFilterFacetBooleanItem,
  FilterFacetRange as UIFilterFacetRange,
  FilterFacets as UIFilterFacets,
} from '@faststore/ui'
import { gql } from '@generated/gql'
import type { Filter_FacetsFragment } from '@generated/graphql'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { useFilter } from 'src/sdk/search/useFilter'

interface Props {
  /**
   * The array that represents the details of every facet.
   */
  facets: Filter_FacetsFragment[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Title for the `FilterDesktop` component.
   */
  title?: string
  /**
   * Settings for specific values related to shipping (e.g., custom name for title, delivery, pickup, pickup-nearby).
   */
  shippingSettings?: {
    titleLabel?: string
    description?: string
    customLabels?: Record<string, string>
  }
}

function FilterDesktop({
  facets,
  testId,
  dispatch,
  expanded,
  title,
  shippingSettings = {},
}: Props & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, state, setState } = useSearch()

  console.log(facets, 'FACETS DESKTOP')

  const shippingLabel = shippingSettings.titleLabel ?? 'Delivery'

  const mapShippingLabel: Record<string, string> = {
    delivery: shippingSettings.customLabels?.delivery ?? 'Deliver to',
    'pickup-nearby':
      shippingSettings.customLabels?.pickupNearby ?? 'Pickup Nearby',
    'pickup-all':
      shippingSettings.customLabels?.pickupAll ?? 'Pickup All Locations',
    'pickup-anywhere':
      shippingSettings.customLabels?.pickupAnywhere ?? 'Pickup Anywhere',
  }

  function shippingOptions(item: any) {
    if (item.value === 'delivery') {
      return (
        <>
          {mapShippingLabel[item.value]}
          <UIButton
            data-fs-filter-list-item-button
            size="small"
            onClick={() => {
              // TODO: open edit local slideOver
              window.alert('Open Modal')
            }}
          >
            Melrose, 12121
          </UIButton>
        </>
      )
    }
    return mapShippingLabel[item.value]
  }

  return (
    <UIFilter
      testId={`desktop-${testId}`}
      title={title}
      indicesExpanded={expanded}
      onAccordionChange={(idx) =>
        dispatch({ type: 'toggleExpanded', payload: idx })
      }
    >
      {facets.map((facet, index) => {
        console.log(facet, 'FACET DESKTOP LOOP')
        const { __typename: type, label } = facet
        const isExpanded = expanded.has(index)
        return (
          <>
            <UIFilterFacets
              key={`${testId}-${label}-${index}`}
              testId={testId}
              index={index}
              type={type}
              label={facet.key === 'shipping' ? shippingLabel : label}
              description={
                facet.key === 'shipping'
                  ? 'Offers and delivery options vary based on region.'
                  : null
              }
            >
              {type === 'StoreFacetBoolean' && isExpanded && (
                <UIFilterFacetBoolean>
                  {facet.values.map((item) => (
                    <UIFilterFacetBooleanItem
                      key={`${testId}-${facet.label}-${item.label}`}
                      id={`${testId}-${facet.label}-${item.label}`}
                      testId={testId}
                      onFacetChange={(facet) => {
                        setState({
                          ...state,
                          selectedFacets: toggleFacet(
                            state.selectedFacets,
                            facet
                          ),
                          page: 0,
                        })
                        resetInfiniteScroll(0)
                      }}
                      selected={item.selected}
                      value={item.value}
                      quantity={item.quantity}
                      facetKey={facet.key}
                      label={
                        facet.key === 'shipping'
                          ? shippingOptions(item)
                          : item.label
                      }
                      type={facet.key === 'shipping' ? 'radio' : 'checkbox'}
                    />
                  ))}
                </UIFilterFacetBoolean>
              )}
              {type === 'StoreFacetRange' && isExpanded && (
                <UIFilterFacetRange
                  facetKey={facet.key}
                  min={facet.min}
                  max={facet.max}
                  formatter={
                    facet.key.toLowerCase() === 'price'
                      ? useFormattedPrice
                      : undefined
                  }
                  onFacetChange={(facet) => {
                    setState({
                      ...state,
                      selectedFacets: setFacet(
                        state.selectedFacets,
                        facet,
                        true
                      ),
                      page: 0,
                    })
                    resetInfiniteScroll(0)
                  }}
                />
              )}
            </UIFilterFacets>
          </>
        )
      })}
    </UIFilter>
  )
}

export const fragment = gql(`
  fragment Filter_facets on StoreFacet {
    ... on StoreFacetRange {
      key
      label

      min {
        selected
        absolute
      }

      max {
        selected
        absolute
      }

      __typename
    }
    ... on StoreFacetBoolean {
      key
      label
      values {
        label
        value
        selected
        quantity
      }

      __typename
    }
  }
`)

export default FilterDesktop
