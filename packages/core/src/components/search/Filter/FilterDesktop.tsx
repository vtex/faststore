import { setFacet, toggleFacet, toggleFacets, useSearch } from '@faststore/sdk'

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
import { deliveryPromise } from 'discovery.config'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { useFilter } from 'src/sdk/search/useFilter'
import { usePickupPoints } from 'src/sdk/shipping/usePickupPoints'
import type { FilterSliderProps } from './FilterSlider'

import { sessionStore } from 'src/sdk/session'
import { getRegionalizationSettings } from 'src/utils/globalSettings'

import { RegionSlider } from 'src/components/region/RegionSlider'
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
  deliverySettings,
}: FilterDesktopProps & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, state, setState } = useSearch()
  const {
    regionSlider: { type: regionSliderType },
    openRegionSlider,
  } = useUI()
  const pickupPoints = usePickupPoints()
  const { postalCode } = sessionStore.read()

  const toggleFilterFacet = (
    facet: { key: string; value: string },
    unique?: boolean
  ) => {
    setState({
      ...state,
      selectedFacets: toggleFacet(
        // In case a new facet is added, filter out existing 'pickupPoint' facet to remove it from the search params
        state.selectedFacets.filter(({ key }) => key !== 'pickupPoint'),
        facet,
        unique
      ),
      page: 0,
    })
  }

  const togglePickupInPointFacet = (
    pickupInPointFacets: { key: string; value: string }[]
  ) => {
    setState({
      ...state,
      selectedFacets: toggleFacets(
        state.selectedFacets,
        pickupInPointFacets,
        true
      ),
      page: 0,
    })
  }

  // Delivery Promise consts
  const regionalizationData = getRegionalizationSettings({ deliverySettings })
  const { deliverySettings: deliverySettingsData } = regionalizationData
  const deliveryLabel = deliverySettingsData?.title ?? 'Delivery'
  const isDeliveryPromiseEnabled = deliveryPromise.enabled
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

  const allDeliveryMethodsFacet = {
    value: 'all-delivery-methods',
    label:
      deliverySettingsData?.deliveryMethods?.allDeliveryMethods ??
      'All delivery methods',
    selected: !state.selectedFacets.some(
      (facet) =>
        facet.key === 'shipping' && facet.value !== 'all-delivery-methods'
    ),
    quantity: 0,
  }

  let filteredFacets = facets.filter((facet) => facet.key !== 'shipping')
  if (isDeliveryPromiseEnabled) {
    filteredFacets = facets.map((facet) => {
      if (
        facet.key === 'shipping' &&
        facet.__typename === 'StoreFacetBoolean'
      ) {
        const hasAllDeliveryMethodsFacet = facet.values.some(
          (item) => item.value === allDeliveryMethodsFacet.value
        )
        if (!hasAllDeliveryMethodsFacet) {
          facet.values = [allDeliveryMethodsFacet, ...facet.values]
        }

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
            description={deliverySettingsData?.description}
          >
            <UIButton
              data-fs-filter-list-delivery-button
              variant="secondary"
              onClick={() => {
                openRegionSlider(regionSliderTypes.setLocation)
              }}
              icon={<UIIcon name="MapPin" />}
            >
              {deliverySettingsData?.setLocationButtonLabel ?? 'Set Location'}
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
                isDeliveryFacet ? deliverySettingsData?.description : undefined
              }
            >
              {type === 'StoreFacetBoolean' && isExpanded && (
                <UIFilterFacetBoolean>
                  {facet.values.map(
                    (item) =>
                      (item.value !== 'pickup-all' || isPickupAllEnabled) && (
                        <UIFilterFacetBooleanItem
                          key={`${testId}-${facet.label}-${item.label}`}
                          id={`${testId}-${facet.label}-${item.label}`}
                          testId={testId}
                          onFacetChange={(facet) => {
                            if (facet.value === 'pickup-in-point') {
                              togglePickupInPointFacet([
                                facet,
                                {
                                  key: 'pickupPoint',
                                  value: selectedPickupPoint?.id,
                                },
                              ])
                            } else {
                              toggleFilterFacet(facet)
                            }

                            resetInfiniteScroll(0)
                          }}
                          selected={item.selected}
                          value={item.value}
                          quantity={item.quantity}
                          facetKey={facet.key}
                          label={
                            isDeliveryFacet ? (
                              <FilterDeliveryMethodFacet
                                item={item}
                                deliveryMethods={
                                  deliverySettingsData?.deliveryMethods
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
          )
        })}
      </UIFilter>
      <RegionSlider
        cmsData={regionalizationData}
        open={regionSliderType !== 'none'}
      />
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
