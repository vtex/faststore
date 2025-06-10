import { toggleFacets, useSearch } from '@faststore/sdk'
import {
  useUI,
  type FilterSliderProps as UIFilterSliderProps,
  type IconProps as UIIconProps,
  type InputFieldProps as UIInputFieldProps,
} from '@faststore/ui'
import dynamic from 'next/dynamic'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import useRegion from 'src/components/region/RegionModal/useRegion'
import { PickupPointCards } from 'src/components/ui/PickupPoints'
import { useSession } from 'src/sdk/session'
import { getRegionalizationSettings } from 'src/utils/globalSettings'
import styles from './section.module.scss'

import { useDelivery } from 'src/sdk/delivery'

const UIFilterSlider = dynamic<UIFilterSliderProps>(
  () =>
    /* webpackChunkName: "UIFilterSlider" */
    import('@faststore/ui').then((mod) => mod.FilterSlider),
  { ssr: false }
)
const UIInputField = dynamic<UIInputFieldProps>(() =>
  /* webpackChunkName: "UIInputField" */
  import('@faststore/ui').then((mod) => mod.InputField)
)
const UIIcon = dynamic<UIIconProps>(() =>
  /* webpackChunkName: "UIIcon" */
  import('@faststore/ui').then((mod) => mod.Icon)
)
const UILink = dynamic(() =>
  /* webpackChunkName: "UILink" */
  import('@faststore/ui').then((mod) => mod.Link)
)

function RegionSlider() {
  const {
    regionSlider: { type: regionSliderType, isOpen },
    closeRegionSlider,
  } = useUI()

  if (!isOpen) return null

  const inputRef = useRef<HTMLInputElement>(null)
  const { isValidating, ...session } = useSession()
  const { loading, setRegion, regionError, setRegionError } = useRegion()
  const { pickupPoints, dispatchDeliveryAction } = useDelivery()
  const { state, setState } = useSearch()

  const [input, setInput] = useState<string>(session.postalCode ?? '')
  const [appliedInput, setAppliedInput] = useState<string>(
    session.postalCode ?? ''
  )

  const cmsData = getRegionalizationSettings()
  const inputField = cmsData?.inputField
  const idkPostalCodeLink = cmsData?.idkPostalCodeLink

  const handleSubmit = async () => {
    setAppliedInput(input)

    if (isValidating) {
      return
    }

    await setRegion({
      session,
      onSuccess: () => {
        dispatchDeliveryAction({ type: 'onPostalCodeChange' })

        if (
          regionSliderType !== 'changePickupPoint' &&
          regionSliderType !== 'globalChangePickupPoint'
        ) {
          setInput('')
          closeRegionSlider()
        }
      },
      postalCode: input,
      errorMessage: inputField?.errorMessage,
      noProductsAvailableErrorMessage:
        inputField?.noProductsAvailableErrorMessage,
    })
  }

  const selectedPickupPointFacet = state.selectedFacets.find(
    ({ key }) => key === 'pickupPoint'
  )?.value

  const [pickupPointOption, setPickupPointOption] = useState<string | null>(
    selectedPickupPointFacet ?? null
  )

  const handlePickupPointOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPickupPointOption(e.target.value)
  }

  const handlePickupPointUpdate = () => {
    const shippingFacet = state.selectedFacets.find(
      (facet) => facet.key === 'shipping'
    )

    // If shipping is not 'pickup-in-point', we need to toggle it
    const facetsToToggle = []

    if (!shippingFacet || shippingFacet.value !== 'pickup-in-point') {
      facetsToToggle.push({ key: 'shipping', value: 'pickup-in-point' })
    }

    // Add/update the pickupPoint facet
    if (pickupPointOption) {
      facetsToToggle.push({ key: 'pickupPoint', value: pickupPointOption })
      dispatchDeliveryAction({
        type: 'changePickupPoint',
        payload: pickupPoints.find(
          (pickupPoint) => pickupPoint.id === pickupPointOption
        ),
      })
    }

    // We don't want to toggle facets when shopper is global filtering
    if (
      regionSliderType !== 'globalChangePickupPoint' &&
      facetsToToggle.length > 0
    ) {
      setState({
        ...state,
        selectedFacets: toggleFacets(
          state.selectedFacets,
          facetsToToggle,
          true
        ),
        page: 0,
      })
    }
  }

  const idkPostalCodeLinkProps = {
    href: idkPostalCodeLink?.to,
    children: (
      <>
        {idkPostalCodeLink?.text}
        {!!idkPostalCodeLink?.icon?.icon && (
          <UIIcon
            name={idkPostalCodeLink?.icon?.icon}
            aria-label={idkPostalCodeLink?.icon?.alt}
            width={20}
            height={20}
          />
        )}
      </>
    ),
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <UIFilterSlider
      data-fs-filter-region-slider
      testId="fs-region-slider"
      overlayProps={{
        className: `section ${styles.section} section-filter-slider`,
      }}
      title={
        regionSliderType !== 'none'
          ? cmsData?.deliverySettings?.regionSlider?.title?.[regionSliderType]
          : ''
      }
      size="partial"
      direction="rightSide"
      onClose={() => {}}
      footer={
        ['changePickupPoint', 'globalChangePickupPoint'].includes(
          regionSliderType
        )
          ? true
          : false
      }
      applyBtnProps={
        ['changePickupPoint', 'globalChangePickupPoint'].includes(
          regionSliderType
        )
          ? {
              variant: 'primary',
              children:
                cmsData?.deliverySettings?.regionSlider
                  ?.pickupPointChangeApplyButtonLabel,
              disabled:
                loading ||
                input === '' ||
                !pickupPointOption ||
                pickupPointOption === selectedPickupPointFacet ||
                regionError !== '' ||
                input !== appliedInput ||
                pickupPoints?.length === 0,
              onClick: () => handlePickupPointUpdate(),
            }
          : undefined
      }
    >
      <div data-fs-filter-region-slider-content>
        <span data-fs-filter-region-slider-description>
          {cmsData?.deliverySettings?.description}
        </span>
        <UIInputField
          id="region-slider-input-field"
          inputRef={inputRef}
          label={inputField?.label}
          actionable
          value={input}
          buttonActionText={loading ? '...' : inputField?.buttonActionText}
          onInput={(e) => {
            setInput(e.currentTarget.value)
            regionError !== '' && setRegionError('')
          }}
          onSubmit={() => {
            handleSubmit()
          }}
          onClear={() => {
            setInput('')
            setRegionError('')
          }}
          error={regionError}
        />
        {idkPostalCodeLink?.to && (
          <UILink data-fs-filter-delivery-link {...idkPostalCodeLinkProps} />
        )}

        {['changePickupPoint', 'globalChangePickupPoint'].includes(
          regionSliderType
        ) &&
          input !== '' &&
          input === appliedInput &&
          !loading && (
            <PickupPointCards
              pickupPoints={regionError ? [] : pickupPoints}
              selectedOption={pickupPointOption}
              onChange={handlePickupPointOnChange}
              noPickupPointsAvailableMessage={
                pickupPoints?.length === 0
                  ? cmsData.deliverySettings?.regionSlider
                      ?.noPickupPointsAvailableInLocation
                  : undefined
              }
              errorMessage={{
                title: regionError,
                description: cmsData?.inputField?.errorMessageHelper,
              }}
              choosePickupPointAriaLabel={
                cmsData?.deliverySettings?.regionSlider
                  ?.choosePickupPointAriaLabel
              }
            />
          )}
      </div>
    </UIFilterSlider>
  )
}

export default RegionSlider
