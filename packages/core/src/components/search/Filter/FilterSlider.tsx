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

import type { Filter_FacetsFragment } from '@generated/graphql'
import FilterDeliveryMethodFacet from './FilterDeliveryMethodFacet'

import {
  DELIVERY_OPTIONS_FACET_KEY,
  PICKUP_ALL_FACET_VALUE,
  SHIPPING_FACET_KEY,
  useDeliveryPromise,
} from 'src/sdk/deliveryPromise'
import type { useFilter } from 'src/sdk/search/useFilter'
import { getGlobalSettings } from 'src/utils/globalSettings'

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
}: FilterSliderProps & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, setState, state } = useSearch()
  const { openRegionSlider } = useUI()

  const cmsData = getGlobalSettings()
  const { deliveryPromise: deliveryPromiseSettings, filters: filtersSettings } =
    cmsData ?? {}
  const filterFacetRangeSettings = filtersSettings?.filterFacetRange

  const {
    facets: filteredFacets,
    labelsMap,
    isPickupAllEnabled,
    shouldDisplayDeliveryButton,
    onDeliveryFacetChange,
  } = useDeliveryPromise({
    selectedFilterFacets: selected,
    allFacets: facets,
    deliveryPromiseSettings,
  })

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

            const isOtherShippingFacetSelected = selected.some(
              ({ key, value }) =>
                key === 'shipping' && value !== 'pickup-in-point'
            )
            const removePickupPointFacet = selected.filter(
              ({ key }) => key !== 'pickupPoint'
            )

            setState({
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
              label={labelsMap[SHIPPING_FACET_KEY] ?? 'Delivery'}
              description={
                deliveryPromiseSettings?.deliveryMethods?.description
              }
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
            const isDeliveryOptionFacet =
              facet.key === DELIVERY_OPTIONS_FACET_KEY

            const sectionLabel =
              labelsMap[facet.key as keyof typeof labelsMap] ?? label

            return (
              <UIFilterFacets
                key={`${testId}-${sectionLabel}-${index}`}
                testId={`mobile-${testId}`}
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
                            testId={`mobile-${testId}`}
                            onFacetChange={(facet) => {
                              onDeliveryFacetChange({
                                facet,
                                filterDispatch: dispatch,
                              })
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
    </>
  )
}

export default FilterSlider
