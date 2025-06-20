import { setFacet, toggleFacet, useSearch } from '@faststore/sdk'

import {
  Button as UIButton,
  Filter as UIFilter,
  FilterFacetBoolean as UIFilterFacetBoolean,
  FilterFacetBooleanItem as UIFilterFacetBooleanItem,
  FilterFacetRange as UIFilterFacetRange,
  FilterFacets as UIFilterFacets,
  Icon as UIIcon,
} from '@faststore/ui'
import { gql } from '@generated/gql'
import { deliveryPromise } from 'discovery.config'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { useFilter } from 'src/sdk/search/useFilter'
import type { FilterSliderProps } from './FilterSlider'

import { sessionStore } from 'src/sdk/session'
import FilterDeliveryOption from './FilterDeliveryOption'

interface FilterDesktopProps
  extends Omit<
    FilterSliderProps,
    'onClose' | 'size' | 'direction' | 'applyBtnProps' | 'clearBtnProps'
  > {}

function FilterDesktop({
  facets,
  testId,
  dispatch,
  expanded,
  title,
  deliverySettings,
}: FilterDesktopProps & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, state, setState } = useSearch()

  const deliveryLabel = deliverySettings?.title ?? 'Delivery'
  const { postalCode } = sessionStore.read()

  const shouldDisplayDeliveryButton = deliveryPromise.enabled && !postalCode
  const filteredFacets = deliveryPromise.enabled
    ? facets
    : facets.filter((facet) => facet.key !== 'shipping')

  return (
    <UIFilter
      testId={`desktop-${testId}`}
      title={title}
      indicesExpanded={expanded}
      onAccordionChange={(idx) =>
        dispatch({ type: 'toggleExpanded', payload: idx })
      }
    >
      {shouldDisplayDeliveryButton && (
        <UIFilterFacets
          key={`${testId}-delivery-unset`}
          testId={testId}
          index={0}
          type=""
          label={deliveryLabel}
          description={deliverySettings?.description}
        >
          <UIButton
            data-fs-filter-list-delivery-button
            variant="secondary"
            onClick={() => {
              // TODO: open edit local slideOver
            }}
            icon={<UIIcon name="MapPin" />}
          >
            {deliverySettings?.setLocationButtonLabel ?? 'Set Location'}
          </UIButton>
        </UIFilterFacets>
      )}
      {filteredFacets.map((facet, idx) => {
        const index = shouldDisplayDeliveryButton ? idx + 1 : idx
        const { __typename: type, label } = facet
        const isExpanded = expanded.has(index)
        const isDeliveryFacet = facet.key === 'shipping'

        return (
          <UIFilterFacets
            key={`${testId}-${label}-${index}`}
            testId={testId}
            index={index}
            type={type}
            label={isDeliveryFacet ? deliveryLabel : label}
            description={
              isDeliveryFacet ? deliverySettings.description : undefined
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
                          facet,
                          true
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
                      isDeliveryFacet ? (
                        <FilterDeliveryOption
                          item={item}
                          deliveryCustomLabels={
                            deliverySettings.deliveryCustomLabels
                          }
                        />
                      ) : (
                        item.label
                      )
                    }
                    type={isDeliveryFacet ? 'radio' : 'checkbox'}
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
                    selectedFacets: setFacet(state.selectedFacets, facet, true),
                    page: 0,
                  })
                  resetInfiniteScroll(0)
                }}
              />
            )}
          </UIFilterFacets>
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
