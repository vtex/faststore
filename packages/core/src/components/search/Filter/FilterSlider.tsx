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

import type { useFilter } from 'src/sdk/search/useFilter'

import {
  getRegionalizationSettings,
  type RegionalizationCmsData,
} from 'src/utils/globalSettings'

import styles from './section.module.scss'
import { useDeliveryPromise } from 'src/sdk/deliveryPromise'

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
  const { openRegionSlider } = useUI()

  const {
    facets: filteredFacets,
    deliveryLabel,
    isPickupAllEnabled,
    shouldDisplayDeliveryButton,
    onDeliveryFacetChange,
  } = useDeliveryPromise({
    selectedFilterFacets: selected,
    allFacets: facets,
    deliverySettings,
  })

  const regionalizationData = getRegionalizationSettings({
    deliverySettings,
  })
  const { deliverySettings: deliverySettingsData } = regionalizationData

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
              description={deliverySettingsData?.description}
            >
              <UIButton
                data-fs-filter-list-delivery-button
                variant="secondary"
                onClick={() => openRegionSlider(regionSliderTypes.setLocation)}
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
                testId={`mobile-${testId}`}
                index={index}
                type={type}
                label={isDeliveryFacet ? deliveryLabel : label}
                description={
                  isDeliveryFacet
                    ? deliverySettingsData?.description
                    : undefined
                }
              >
                {type === 'StoreFacetBoolean' && isExpanded && (
                  <UIFilterFacetBoolean>
                    {facet.values.map(
                      (item) =>
                        (item.value !== 'pickup-all' || isPickupAllEnabled) && (
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
