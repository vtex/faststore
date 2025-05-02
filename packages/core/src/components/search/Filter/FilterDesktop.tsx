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

export interface FilterDesktopProps {
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
   * CMS settings for values related to delivery (e.g., custom name for title, delivery, pickup, pickup-nearby).
   */
  deliverySettings?: {
    sectionTitle?: string
    sectionDescription?: string
    deliveryCustomLabels?: Record<string, string>
  }
}

function FilterDesktop({
  facets,
  testId,
  dispatch,
  expanded,
  title,
  deliverySettings,
}: FilterDesktopProps & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, state, setState } = useSearch()

  console.log(deliverySettings, 'deliverySettings')
  const shippingLabel = deliverySettings.sectionTitle ?? 'Delivery'

  const mapShippingLabel: Record<string, string> = {
    delivery: deliverySettings.deliveryCustomLabels?.delivery ?? 'Deliver to',
    'pickup-in-point':
      deliverySettings.deliveryCustomLabels?.pickupInPoint ?? 'Pickup at',
    'pickup-nearby':
      deliverySettings.deliveryCustomLabels?.pickupNearby ?? 'Pickup Nearby',
    'pickup-all':
      deliverySettings.deliveryCustomLabels?.pickupAll ?? 'Pickup Anywhere',
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
    if (item.value === 'pickup-in-point') {
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
            Robson St
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
                  ? deliverySettings.description
                  : undefined
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
