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
}

function FilterDesktop({
  facets,
  testId,
  dispatch,
  expanded,
  title,
}: Props & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, state, setState } = useSearch()

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
        const { __typename: type, label } = facet
        const isExpanded = expanded.has(index)
        return (
          <>
            <UIFilterFacets
              key={`${testId}-${label}-${index}`}
              testId={testId}
              index={index}
              type={type}
              label={label}
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
                      label={item.label}
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

      <UIFilterFacets // MOCKED: adding here just for testing purposes / TODO: REMOVE and add dynamic data when facets available!
        key="test-delivery"
        testId={testId}
        index={3}
        type="StoreFacetBoolean"
        label="Delivery"
        description="Offers and delivery options vary based on region."
      >
        <UIFilterFacetBoolean>
          <UIFilterFacetBooleanItem
            key={`${testId}-test-delivery-1`}
            id="test-delivery-item-1"
            testId="test-delivery-item-1"
            onFacetChange={() => {}}
            selected={true}
            value="test-delivery-item-1"
            facetKey="facet-delivery"
            label={
              <>
                Deliver to
                <UIButton
                  data-fs-filter-list-item-button
                  size="small"
                  onClick={() => {
                    // MOCKED: open edit local slide over
                    window.alert('Open Modal')
                  }}
                >
                  Melrose, 12121
                </UIButton>
              </>
            }
            type="radio"
          />
          <UIFilterFacetBooleanItem
            key={`${testId}-test-delivery-2`}
            id="test-delivery-item-2"
            testId="test-delivery-item-2"
            onFacetChange={() => {}}
            selected={true}
            value="test-delivery-item-2"
            facetKey="facet-delivery"
            label={
              <>
                Pick up at
                <UIButton
                  data-fs-filter-list-item-button
                  size="small"
                  onClick={() => {
                    // MOCKED: open edit local slide over
                    window.alert('Open Modal')
                  }}
                >
                  Robson St.
                </UIButton>
              </>
            }
            type="radio"
          />
          <UIFilterFacetBooleanItem
            key={`${testId}-test-delivery-3`}
            id="test-delivery-item-3"
            testId="test-delivery-item-3"
            onFacetChange={() => {}}
            selected={true}
            value="test-delivery-item-3"
            facetKey="facet-delivery"
            label="Pick up nearby"
            type="radio"
          />
          <UIFilterFacetBooleanItem
            key={`${testId}-test-delivery-4`}
            id="test-delivery-item-4"
            testId="test-delivery-item-4"
            onFacetChange={() => {}}
            selected={true}
            value="test-delivery-item-4"
            facetKey="facet-delivery"
            label="Pick up anywhere"
            type="radio"
          />
        </UIFilterFacetBoolean>
      </UIFilterFacets>
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
