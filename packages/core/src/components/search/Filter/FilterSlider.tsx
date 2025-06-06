import dynamic from 'next/dynamic'

import { useSearch } from '@faststore/sdk'
import {
  regionSliderTypes,
  useUI,
  type ButtonProps as UIButtonProps,
  type FilterFacetBooleanItemProps as UIFilterFacetBooleanItemProps,
  type FilterFacetRangeProps as UIFilterFacetRangeProps,
  type FilterFacetsProps as UIFilterFacetsProps,
  type FilterProps as UIFilterProps,
  type FilterSliderProps as UIFilterSliderProps,
  type IconProps as UIIconProps,
} from '@faststore/ui'

import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { usePickupPoints } from 'src/sdk/shipping/usePickupPoints'

import { deliveryPromise } from 'discovery.config'

import type { Filter_FacetsFragment } from '@generated/graphql'
import FilterDeliveryOption from './FilterDeliveryOption'

import type { useFilter } from 'src/sdk/search/useFilter'
import { sessionStore } from 'src/sdk/session'

import {
  getRegionalizationSettings,
  type RegionalizationCmsData,
} from 'src/utils/globalSettings'

import { RegionSlider } from 'src/components/region/RegionSlider'

import styles from './section.module.scss'

const UIFilter = dynamic<{ children: React.ReactNode } & UIFilterProps>(() =>
  /* webpackChunkName: "UIFilter" */
  import('@faststore/ui').then((mod) => mod.Filter)
)
const UIFilterFacetBoolean = dynamic<{ children: React.ReactNode }>(() =>
  /* webpackChunkName: "UIFilterFacetBoolean" */
  import('@faststore/ui').then((mod) => mod.FilterFacetBoolean)
)
const UIFilterFacetBooleanItem = dynamic<UIFilterFacetBooleanItemProps>(() =>
  /* webpackChunkName: "UIFilterFacetBooleanItem" */
  import('@faststore/ui').then((mod) => mod.FilterFacetBooleanItem)
)
const UIFilterFacetRange = dynamic<UIFilterFacetRangeProps>(() =>
  /* webpackChunkName: "UIFilterFacetRange" */
  import('@faststore/ui').then((mod) => mod.FilterFacetRange)
)
const UIFilterFacets = dynamic<
  { children: React.ReactNode } & UIFilterFacetsProps
>(() =>
  /* webpackChunkName: "UIFilterFacets" */
  import('@faststore/ui').then((mod) => mod.FilterFacets)
)
const UIFilterSlider = dynamic<UIFilterSliderProps>(() =>
  /* webpackChunkName: "UIFilterSlider" */
  import('@faststore/ui').then((mod) => mod.FilterSlider)
)
const UIButton = dynamic<UIButtonProps>(() =>
  /* webpackChunkName: "UIButton" */
  import('@faststore/ui').then((mod) => mod.Button)
)
const UIIcon = dynamic<UIIconProps>(() =>
  /* webpackChunkName: "UIIcon" */
  import('@faststore/ui').then((mod) => mod.Icon)
)
export interface FilterSliderProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * The array that represents the details of every facet.
   */
  facets: Filter_FacetsFragment[]
  /**
   * Title for the `Filter` component.
   */
  title?: string
  /**
   * CMS defined label for the clear button component.
   */
  clearButtonLabel?: string
  /**
   * CMS defined label for the apply button component.
   */
  applyButtonLabel?: string
  /**
   * CMS settings for values related to delivery (e.g., custom name for title, shipping, pickup, pickup-nearby).
   */
  deliverySettings?: RegionalizationCmsData['deliverySettings']
}

function FilterSlider({
  facets,
  testId,
  dispatch,
  expanded,
  selected,
  title,
  clearButtonLabel,
  applyButtonLabel,
  deliverySettings,
}: FilterSliderProps & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, setState, state } = useSearch()
  const {
    regionSlider: { type: regionSliderType },
    openRegionSlider,
  } = useUI()
  const pickupPoints = usePickupPoints()
  const { postalCode } = sessionStore.read()

  const toggleFilterFacets = (facets: { key: string; value: string }[]) => {
    dispatch({
      type: 'toggleFacets',
      payload: {
        facets,
        unique: true,
      },
    })
  }

  const togglePickupInPointFacet = (
    pickupInPointFacets: { key: string; value: string }[]
  ) => {
    dispatch({
      type: 'toggleFacets',
      payload: {
        facets: pickupInPointFacets,
        unique: true,
      },
    })
  }

  // Delivery Promise consts
  const regionalizationData = getRegionalizationSettings(deliverySettings)
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

  // If no pickup point is selected, use the first one as default
  const selectedPickupPoint =
    pickupPoints?.find(({ id }) => id === selectedPickupPointId) ??
    defaultPickupPoint

  const pickupInPointFacet =
    isDeliveryPromiseEnabled && selectedPickupPoint
      ? {
          value: 'pickup-in-point',
          label:
            selectedPickupPoint?.name ?? selectedPickupPoint?.addressStreet,
          selected: !!selected.find(({ value }) => value === 'pickup-in-point'),
          quantity: selectedPickupPoint?.totalItems,
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
          if (selected.some(({ key }) => key === 'shipping')) {
            const selectedShippingFacet = selected.find(
              ({ key }) => key === 'shipping'
            )
            const selectedPickupInPointFacets = selected.filter(
              ({ key, value }) =>
                value === 'pickup-in-point' || key === 'pickupPoint'
            )

            selectedPickupInPointFacets.length !== 0
              ? togglePickupInPointFacet(selectedPickupInPointFacets)
              : toggleFilterFacets([selectedShippingFacet])
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
      <UIFilterSlider
        overlayProps={{
          className: `section ${styles.section} section-filter-slider`,
        }}
        title={title}
        size="partial"
        direction="rightSide"
        clearBtnProps={{
          variant: 'secondary',
          onClick: () => dispatch({ type: 'selectFacets', payload: [] }),
          children: clearButtonLabel ?? 'Clear All',
        }}
        applyBtnProps={{
          variant: 'primary',
          onClick: () => {
            resetInfiniteScroll(0)

            const isOtherShippingFacetSelected = selected.find(
              ({ key, value }) =>
                key === 'shipping' && value !== 'pickup-in-point'
            )
            const removePickupPointFacet = selected.filter(
              ({ key }) => key !== 'pickupPoint'
            )

            setState({
              ...state,
              selectedFacets: isOtherShippingFacetSelected
                ? removePickupPointFacet
                : selected,
              page: 0,
            })
          },
          children: applyButtonLabel ?? 'Apply',
        }}
        onClose={() => {
          dispatch({
            type: 'selectFacets',
            payload: state.selectedFacets,
          })
        }}
      >
        <UIFilter
          testId={`mobile-${testId}`}
          indicesExpanded={expanded}
          onAccordionChange={(index: number) =>
            dispatch({ type: 'toggleExpanded', payload: index })
          }
        >
          {shouldDisplayDeliveryButton && (
            <UIFilterFacets
              key={`${testId}-delivery-0`}
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
                  openRegionSlider(regionSliderTypes.setLocation)
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
                testId={`mobile-${testId}`}
                index={index}
                type={type}
                label={isDeliveryFacet ? deliveryLabel : label}
                description={
                  isDeliveryFacet ? deliverySettings?.description : undefined
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
                            testId={`mobile-${testId}`}
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
                                toggleFilterFacets([
                                  ...selected.filter(
                                    ({ key }) => key === 'pickupPoint'
                                  ),
                                  facet,
                                ])
                              }
                            }}
                            selected={item.selected}
                            value={item.value}
                            quantity={item.quantity}
                            facetKey={facet.key}
                            label={
                              isDeliveryFacet ? (
                                <FilterDeliveryOption
                                  item={item}
                                  deliveryMethods={
                                    deliverySettings?.deliveryMethods
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
                    onFacetChange={(facet) =>
                      dispatch({
                        type: 'setFacet',
                        payload: { facet, unique: true },
                      })
                    }
                  />
                )}
              </UIFilterFacets>
            )
          })}
        </UIFilter>
      </UIFilterSlider>
      <RegionSlider
        cmsData={regionalizationData}
        open={regionSliderType !== 'none'}
      />
    </>
  )
}

export default FilterSlider
