import { toggleFacets, useSearch, type Session } from '@faststore/sdk'
import {
  useUI,
  type FilterSliderProps as UIFilterSliderProps,
  type IconProps as UIIconProps,
  type InputFieldProps as UIInputFieldProps,
} from '@faststore/ui'
import dynamic from 'next/dynamic'
import type { MouseEvent } from 'react'
import { useEffect, useRef, useState, useMemo } from 'react'
import useRegion from 'src/components/region/RegionModal/useRegion'
import { PickupPointCards } from 'src/components/ui/PickupPoints'
import { useSession, sessionStore } from 'src/sdk/session'
import {
  useDeliveryPromise,
  SHIPPING_FACET_KEY,
  PICKUP_IN_POINT_FACET_VALUE,
  PICKUP_POINT_FACET_KEY,
} from 'src/sdk/deliveryPromise'
import { getRegionalizationSettings } from 'src/utils/globalSettings'
import styles from './section.module.scss'

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
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    regionSlider: { type: regionSliderType, isOpen },
    closeRegionSlider,
  } = useUI()
  const { isValidating, ...session } = useSession()
  const { state: searchState, setState: setSearchState } = useSearch()
  const { loading, setRegion, regionError, setRegionError } = useRegion()
  const {
    pickupPoints: statePickupPoints,
    onPostalCodeChange,
    changeGlobalPickupPoint,
    changePickupPoint,
    selectedPickupPointFacet,
    pickupPointsSimulation,
    clearPickupPointsSimulation,
  } = useDeliveryPromise()

  const isChangingPickupPoint = useMemo(
    () =>
      ['changePickupPoint', 'globalChangePickupPoint'].includes(
        regionSliderType
      ),
    [regionSliderType]
  )
  const pickupPoints = useMemo(
    () =>
      pickupPointsSimulation && pickupPointsSimulation.pickupPoints.length !== 0
        ? pickupPointsSimulation.pickupPoints
        : statePickupPoints,
    [statePickupPoints, pickupPointsSimulation]
  )
  const [input, setInput] = useState<string>(session.postalCode ?? '')
  const [appliedInput, setAppliedInput] = useState<string>(
    session.postalCode ?? ''
  )
  const [pickupPointOption, setPickupPointOption] = useState<string | null>(
    selectedPickupPointFacet ?? null
  )
  const [validatedSession, setValidatedSession] = useState<Session>(undefined)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setInput(session.postalCode)
    setAppliedInput(session.postalCode)
  }, [session.postalCode])

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
      preview: true,
      onSuccess: (validatedSession) => {
        setValidatedSession(validatedSession)
        onPostalCodeChange({ simulatePickupPoints: true, validatedSession })

        if (!isChangingPickupPoint) {
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

  const handlePickupPointOnChange = (e: MouseEvent<HTMLInputElement>) => {
    if (pickupPointOption === e.currentTarget.value) {
      return setPickupPointOption(null)
    }

    setPickupPointOption(e.currentTarget.value)
  }

  const handlePickupPointUpdate = () => {
    const shippingFacet = searchState.selectedFacets.find(
      (facet) => facet.key === SHIPPING_FACET_KEY
    )

    if (validatedSession && isChangingPickupPoint) {
      sessionStore.set(validatedSession)
    }

    // If shipping is not 'pickup-in-point', we need to toggle it
    const facetsToToggle = []

    if (!shippingFacet || shippingFacet.value !== PICKUP_IN_POINT_FACET_VALUE) {
      facetsToToggle.push({
        key: SHIPPING_FACET_KEY,
        value: PICKUP_IN_POINT_FACET_VALUE,
      })
    }

    // Add/update the pickupPoint facet
    if (pickupPointOption) {
      facetsToToggle.push({
        key: PICKUP_POINT_FACET_KEY,
        value: pickupPointOption,
      })
      const pickupPointFacet = pickupPoints.find(
        (pickupPoint) => pickupPoint.id === pickupPointOption
      )

      if (regionSliderType === 'changePickupPoint') {
        changePickupPoint(pickupPointFacet)
        changeGlobalPickupPoint(null)
      }

      if (regionSliderType === 'globalChangePickupPoint') {
        changePickupPoint(pickupPointFacet)
        changeGlobalPickupPoint(pickupPointFacet)
      }
    }

    if (facetsToToggle.length > 0) {
      setSearchState({
        ...searchState,
        selectedFacets: toggleFacets(
          searchState.selectedFacets,
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

  if (!isOpen) return null

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
      onClose={() => {
        setInput(session.postalCode)
        setAppliedInput(session.postalCode)
        setValidatedSession(undefined)
        clearPickupPointsSimulation()
      }}
      footer={isChangingPickupPoint ? true : false}
      applyBtnProps={
        isChangingPickupPoint
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

        {isChangingPickupPoint &&
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
