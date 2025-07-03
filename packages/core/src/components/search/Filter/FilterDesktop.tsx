import { setFacet, toggleFacets, useSearch } from '@faststore/sdk'

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

import RegionSlider from 'src/components/region/RegionSlider'
import { useDeliveryPromise } from 'src/sdk/deliveryPromise'
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
  const { resetInfiniteScroll, state, setState } = useSearch()
  const {
    regionSlider: { type: regionSliderType },
    openRegionSlider,
  } = useUI()

  const onFacetChange = (facet: { key: string; value: string }) => {
    let unique = isRadioFacets(facet.key)
    let selected = state.selectedFacets
    const facets = [facet]
    if (facet.value === 'pickup-in-point') {
      unique = true
      facets.push({
        key: 'pickupPoint',
        value: selectedPickupPoint?.id,
      })
    } else {
      selected = selected.filter((el) => el.key !== 'pickupPoint')
    }

    setState({
      ...state,
      selectedFacets: toggleFacets(selected, facets, unique),
      page: 0,
    })
  }

  const cmsData = getGlobalSettings()
  const { deliveryPromise: deliveryPromiseSettings } = cmsData ?? {}

  const {
    selectedPickupPoint,
    facets: filteredFacets,
    deliveryLabel,
    isPickupAllEnabled,
    shouldDisplayDeliveryButton,
  } = useDeliveryPromise({
    selectedFacets: state.selectedFacets,
    toggleFacet: onFacetChange,
    fallbackToFirst: true,
    allFacets: facets,
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
            label={deliveryLabel}
            description={deliveryPromiseSettings?.deliveryMethods?.description}
          >
            <UIButton
              data-fs-filter-list-delivery-button
              variant="secondary"
              onClick={() => {
                openRegionSlider(regionSliderTypes.setLocation)
              }}
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
          const isDeliveryFacet = facet.key === 'shipping'

          return (
            <UIFilterFacets
              key={`${testId}-${label}-${index}`}
              testId={testId}
              index={index}
              type={type}
              label={isDeliveryFacet ? deliveryLabel : label}
              description={
                isDeliveryFacet
                  ? deliveryPromiseSettings?.deliveryMethods?.description
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
                          testId={testId}
                          onFacetChange={(facet) => {
                            onFacetChange(facet)
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
      <RegionSlider cmsData={cmsData} open={regionSliderType !== 'none'} />
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

const RADIO_FACETS = ['shipping', 'pickupPoint'] as const
function isRadioFacets(str: unknown): str is (typeof RADIO_FACETS)[number] {
  if (typeof str !== 'string') return false

  return RADIO_FACETS.some((el) => el === str)
}

export default FilterDesktop
