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
import { usePickupPoints } from 'src/sdk/shipping/usePickupPoints'
import type { FilterSliderProps } from './FilterSlider'

import {
  PICKUP_ALL_FACET_VALUE,
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
  testId = 'filter-desktop',
  dispatch,
  expanded,
  title,
}: FilterDesktopProps & ReturnType<typeof useFilter>) {
  const cmsData = getGlobalSettings()
  const { deliveryPromise: deliveryPromiseSettings } = cmsData ?? {}
  const {
    resetInfiniteScroll,
    state: searchState,
    setState: setSearchState,
  } = useSearch()
  const { openRegionSlider } = useUI()
  const {
    highlightedFacet,
    facetsWithoutHighlightedFacet,
    deliveryLabel,
    deliveryOptionsLabel,
    isPickupAllEnabled,
    shouldDisplayDeliveryButton,
    onDeliveryFacetChange,
    getDynamicEstimateLabel,
  } = useDeliveryPromise({
    allFacets: facets,
    selectedFilterFacets: searchState.selectedFacets,
    deliveryPromiseSettings,
  })

  const isPickupAllEnabled =
    deliverySettingsData?.deliveryMethods?.pickupAll?.enabled ?? false
  const shouldDisplayDeliveryButton = isDeliveryPromiseEnabled && !postalCode

  const defaultPickupPoint = pickupPoints?.[0] ?? undefined
  const selectedPickupPointId = state.selectedFacets.find(
    ({ key }) => key === 'pickupPoint'
  )?.value

  // If no pickup point was previously selected, use the first one as default
  const selectedPickupPoint =
    pickupPoints?.find(({ id }) => id === selectedPickupPointId) ??
    defaultPickupPoint

  const pickupInPointFacet =
    isDeliveryPromiseEnabled && selectedPickupPoint
      ? {
          value: 'pickup-in-point',
          label:
            selectedPickupPoint?.name ?? selectedPickupPoint?.address.street,
          selected: !!state.selectedFacets.find(
            ({ value }) => value === 'pickup-in-point'
          ),
          quantity: selectedPickupPoint?.totalItems ?? 0,
        }
      : undefined

  let filteredFacets = facets.filter((facet) => facet.key !== 'shipping')
  if (isDeliveryPromiseEnabled) {
    filteredFacets = facets.map((facet) => {
      if (
        facet.key === 'shipping' &&
        facet.__typename === 'StoreFacetBoolean'
      ) {
        const pickupInPointFacetIndex = facet.values.findIndex(
          (item) => item?.value === 'pickup-in-point'
        )

        // Remove old pickup `pickup in point` facet from list and search state
        if (pickupInPointFacetIndex !== -1 && !selectedPickupPoint) {
          if (state.selectedFacets.some(({ key }) => key === 'shipping')) {
            const selectedShippingFacet = state.selectedFacets.find(
              ({ key }) => key === 'shipping'
            )
            const selectedPickupInPointFacets = state.selectedFacets.filter(
              ({ key, value }) =>
                value === 'pickup-in-point' || key === 'pickupPoint'
            )

            selectedPickupInPointFacets.length !== 0
              ? togglePickupInPointFacet(selectedPickupInPointFacets)
              : toggleFilterFacet(selectedShippingFacet)
          }

          facet.values = facet.values.filter(
            (_, index) => index !== pickupInPointFacetIndex
          )
        }
        // Prevent multiple `pickup in point` facet
        else if (pickupInPointFacetIndex === -1 && selectedPickupPoint) {
          facet.values.push(pickupInPointFacet)
        }
        // Replace current `pickup-in-point` facet with the updated one
        else if (
          facet.values[pickupInPointFacetIndex] &&
          facet.values[pickupInPointFacetIndex]?.label !==
            pickupInPointFacet.label
        ) {
          facet.values[pickupInPointFacetIndex] = pickupInPointFacet
        }
      }

      return facet
    })
  }

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
            label={deliveryLabel}
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

        {highlightedFacet &&
          highlightedFacet.__typename === 'StoreFacetBoolean' && (
            <UIFilterFacets
              key={`${testId}-${highlightedFacet.key}`}
              testId={testId}
              highlighted
              type={highlightedFacet.__typename}
              index={undefined}
            >
              {highlightedFacet.values.map((item) => (
                <UIFilterFacetBooleanItem
                  key={`${testId}-${highlightedFacet.label}-${item.value}`}
                  id={`${testId}-${highlightedFacet.label}-${item.value}`}
                  testId={testId}
                  onFacetChange={(facet) => {
                    onDeliveryFacetChange({ facet })
                    resetInfiniteScroll(0)
                  }}
                  selected={item.selected}
                  value={item.value}
                  facetKey={highlightedFacet.key}
                  label={getDynamicEstimateLabel(item.value) ?? item.label}
                  type="toggle"
                />
              ))}
            </UIFilterFacets>
          )}

        {facetsWithoutHighlightedFacet.map((facet, idx) => {
          const index = shouldDisplayDeliveryButton ? idx + 1 : idx
          const { __typename: type, label } = facet
          const isExpanded = expanded.has(index)
          const isDeliveryMethodFacet = facet.key === 'shipping'
          const isDeliveryOptionFacet = facet.key === 'delivery-options'

          const sectionLabel = isDeliveryMethodFacet
            ? deliveryLabel
            : isDeliveryOptionFacet
              ? deliveryOptionsLabel
              : label

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
                          type={isDeliveryFacet ? 'radio' : 'checkbox'}
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
