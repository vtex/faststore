import { setFacet, useSearch } from '@faststore/sdk'

import {
  regionSliderTypes,
  Button as UIButton,
  Filter as UIFilter,
  FilterFacetBoolean as UIFilterFacetBoolean,
  FilterFacetBooleanItem as UIFilterFacetBooleanItem,
  FilterFacetRange as UIFilterFacetRange,
  FilterFacets as UIFilterFacets,
  Icon as UIIcon,
  useUI,
} from '@faststore/ui'

import { gql } from '@generated/gql'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { useFilter } from 'src/sdk/search/useFilter'
import type { FilterSliderProps } from './FilterSlider'

import {
  DELIVERY_OPTIONS_FACET_KEY,
  PICKUP_ALL_FACET_VALUE,
  SHIPPING_FACET_KEY,
  useDeliveryPromise,
} from 'src/sdk/deliveryPromise'
import { getGlobalSettings } from 'src/utils/globalSettings'
import FilterDeliveryMethodFacet from './FilterDeliveryMethodFacet'

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
}: FilterDesktopProps & ReturnType<typeof useFilter>) {
  const cmsData = getGlobalSettings()
  const { deliveryPromise: deliveryPromiseSettings, filters: filtersSettings } =
    cmsData ?? {}
  const filterFacetRangeSettings = filtersSettings?.filterFacetRange
  const {
    resetInfiniteScroll,
    state: searchState,
    setState: setSearchState,
  } = useSearch()
  const { openRegionSlider } = useUI()
  const {
    facets: filteredFacets,
    labelsMap,
    isPickupAllEnabled,
    shouldDisplayDeliveryButton,
    onDeliveryFacetChange,
  } = useDeliveryPromise({
    allFacets: facets,
    selectedFilterFacets: searchState.selectedFacets,
    deliveryPromiseSettings,
  })

  return (
    <>
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
            label={labelsMap[SHIPPING_FACET_KEY] ?? 'Delivery'}
            description={deliveryPromiseSettings?.deliveryMethods?.description}
          >
            <UIButton
              data-fs-filter-list-delivery-button
              variant="secondary"
              onClick={() => openRegionSlider(regionSliderTypes.setLocation)}
              icon={<UIIcon name="MapPin" />}
            >
              {deliveryPromiseSettings?.deliveryMethods
                ?.setLocationButtonLabel ?? 'Set Location'}
            </UIButton>
          </UIFilterFacets>
        )}

        {filteredFacets.map((facet, idx) => {
          const index = shouldDisplayDeliveryButton ? idx + 1 : idx
          const { __typename: type, label } = facet
          const isExpanded = expanded.has(index)
          const isDeliveryMethodFacet = facet.key === SHIPPING_FACET_KEY
          const isDeliveryOptionFacet = facet.key === DELIVERY_OPTIONS_FACET_KEY

          const sectionLabel =
            labelsMap[facet.key as keyof typeof labelsMap] ?? label

          return (
            <UIFilterFacets
              key={`${testId}-${sectionLabel}-${index}`}
              testId={testId}
              index={index}
              type={type}
              label={sectionLabel}
              description={
                isDeliveryMethodFacet
                  ? deliveryPromiseSettings?.deliveryMethods?.description
                  : undefined
              }
            >
              {type === 'StoreFacetBoolean' && isExpanded && (
                <UIFilterFacetBoolean>
                  {facet.values.map(
                    (item) =>
                      (item.value !== PICKUP_ALL_FACET_VALUE ||
                        isPickupAllEnabled) && (
                        <UIFilterFacetBooleanItem
                          key={`${testId}-${facet.label}-${item.value}`}
                          id={`${testId}-${facet.label}-${item.value}`}
                          testId={testId}
                          onFacetChange={(facet) => {
                            onDeliveryFacetChange({ facet })
                            resetInfiniteScroll(0)
                          }}
                          selected={item.selected}
                          value={item.value}
                          quantity={item.quantity}
                          facetKey={facet.key}
                          label={
                            isDeliveryMethodFacet ? (
                              <FilterDeliveryMethodFacet
                                item={item}
                                deliveryMethods={
                                  deliveryPromiseSettings?.deliveryMethods
                                }
                              />
                            ) : (
                              item.label
                            )
                          }
                          type={
                            isDeliveryMethodFacet || isDeliveryOptionFacet
                              ? 'radio'
                              : 'checkbox'
                          }
                        />
                      )
                  )}
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
                  minLabel={filterFacetRangeSettings?.minLabel}
                  maxLabel={filterFacetRangeSettings?.maxLabel}
                  minPriceErrorMessage={
                    filterFacetRangeSettings?.minPriceErrorMessage
                  }
                  maxPriceErrorMessage={
                    filterFacetRangeSettings?.maxPriceErrorMessage
                  }
                  onFacetChange={(facet) => {
                    setSearchState({
                      selectedFacets: setFacet(
                        searchState.selectedFacets,
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
          )
        })}
      </UIFilter>
    </>
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
