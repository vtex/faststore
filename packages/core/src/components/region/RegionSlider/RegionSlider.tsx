import { toggleFacets, useSearch, type Session } from '@faststore/sdk'
import {
  useUI,
  type FilterSliderProps as UIFilterSliderProps,
  type IconProps as UIIconProps,
  type InputFieldProps as UIInputFieldProps,
} from '@faststore/ui'
import dynamic from 'next/dynamic'
import type { ChangeEvent, MouseEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import useRegion from 'src/components/region/RegionModal/useRegion'
import { PickupPointCards } from 'src/components/ui/PickupPoints'
import {
  PICKUP_IN_POINT_FACET_VALUE,
  PICKUP_POINT_FACET_KEY,
  SHIPPING_FACET_KEY,
  useDeliveryPromise,
} from 'src/sdk/deliveryPromise'
import { sessionStore, useSession } from 'src/sdk/session'
import { getGlobalSettings } from 'src/utils/globalSettings'
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
  const {
    loading: loadingRegion,
    setRegion,
    regionError,
    setRegionError,
  } = useRegion()
  const {
    pickupPoints: statePickupPoints,
    onPostalCodeChange,
    changeGlobalPickupPoint,
    selectedPickupPointFacet,
    pickupPointsSimulation,
    clearPickupPointsSimulation,
    globalPickupPoint,
    fetchingPickupPoints,
    changePickupPoint,
  } = useDeliveryPromise({ selectedFilterFacets: searchState.selectedFacets })

  const isChangingPickupPoint = useMemo(
    () =>
      ['changePickupPoint', 'globalChangePickupPoint'].includes(
        regionSliderType
      ),
    [regionSliderType]
  )
  const pickupPoints = useMemo(
    () =>
      pickupPointsSimulation?.geoCoordinates
        ? pickupPointsSimulation.pickupPoints
        : statePickupPoints,
    [statePickupPoints, pickupPointsSimulation]
  )

  const [dataLoading, setDataLoading] = useState(
    loadingRegion || fetchingPickupPoints
  )
  const [input, setInput] = useState<string>(session.postalCode ?? '')
  const [appliedInput, setAppliedInput] = useState<string>(
    session.postalCode ?? ''
  )
  const [pickupPointOption, setPickupPointOption] = useState<string | null>(
    regionSliderType === 'globalChangePickupPoint'
      ? (globalPickupPoint?.id ?? null)
      : (selectedPickupPointFacet ?? null)
  )
  const [validatedSession, setValidatedSession] = useState<Session>(undefined)

  useEffect(() => inputRef.current?.focus(), [])

  useEffect(() => setDataLoading(fetchingPickupPoints), [fetchingPickupPoints])

  // Sets default state values based on the `regionSliderType` and when the postal code changes
  useEffect(() => {
    if (regionSliderType === 'none') return

    setInput(session.postalCode)
    setAppliedInput(session.postalCode)
    setPickupPointOption(
      regionSliderType === 'globalChangePickupPoint'
        ? (globalPickupPoint?.id ?? null)
        : (selectedPickupPointFacet ?? null)
    )
    setDataLoading(false)
  }, [session.postalCode, regionSliderType])

  const cmsData = getGlobalSettings()
  const inputField = cmsData?.regionalization?.inputField
  const idkPostalCodeLink = cmsData?.regionalization?.idkPostalCodeLink

  const handleSubmit = async () => {
    setAppliedInput(input)

    if (isValidating) {
      return
    }

    setDataLoading(true)
    setAppliedInput(input)

    await setRegion({
      session,
      simulation: isChangingPickupPoint,
      onSuccess: (newSession) => {
        // Pickup points simulation
        if (newSession) {
          setValidatedSession(newSession)
          onPostalCodeChange({
            simulatePickupPoints: true,
            validatedSession: newSession,
          })
        } else {
          onPostalCodeChange()
        }

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

  const handlePickupPointOnChange = (
    e: ChangeEvent<HTMLInputElement> & MouseEvent<HTMLInputElement>
  ) => {
    if (pickupPointOption === e.currentTarget.value) {
      return setPickupPointOption(null)
    }

    setPickupPointOption(e.currentTarget.value)
  }

  const handlePickupPointUpdate = async () => {
    if (validatedSession && isChangingPickupPoint) {
      sessionStore.set(validatedSession)
    }

    // If shipping is not 'pickup-in-point', we need to toggle it
    const facetsToToggle = []
    const shippingFacet = searchState.selectedFacets.find(
      (facet) => facet.key === SHIPPING_FACET_KEY
    )

    // Add/update the pickupPoint facet
    if (pickupPointOption) {
      facetsToToggle.push({
        key: PICKUP_POINT_FACET_KEY,
        value: pickupPointOption,
      })

      if (regionSliderType === 'globalChangePickupPoint') {
        const pickupPointFacet = pickupPoints.find(
          (pickupPoint) => pickupPoint.id === pickupPointOption
        )

        changeGlobalPickupPoint(pickupPointFacet)
      }
    }

    if (!shippingFacet || shippingFacet.value !== PICKUP_IN_POINT_FACET_VALUE) {
      facetsToToggle.push({
        key: SHIPPING_FACET_KEY,
        value: PICKUP_IN_POINT_FACET_VALUE,
      })
    }

    isChangingPickupPoint && onPostalCodeChange()

    if (facetsToToggle.length > 0) {
      setSearchState({
        selectedFacets: toggleFacets(
          searchState.selectedFacets,
          facetsToToggle,
          true
        ),
        page: 0,
      })
    }
  }

  // The `shouldClearPickupPointsSimulation` param prevent triggering store update more than once.
  const onDismissSlider = async ({
    shouldClearPickupPointsSimulation = true,
  }: { shouldClearPickupPointsSimulation?: boolean } = {}) => {
    setDataLoading(true)
    setInput(session.postalCode)
    setAppliedInput(session.postalCode)
    setValidatedSession(undefined)
    setPickupPointOption(null)
    shouldClearPickupPointsSimulation && clearPickupPointsSimulation()
  }

  const clearFilter = async () => {
    const selectedPickupInPointFacets = searchState.selectedFacets.filter(
      ({ key, value }) =>
        value === PICKUP_IN_POINT_FACET_VALUE || key === PICKUP_POINT_FACET_KEY
    )

    if (selectedPickupInPointFacets.length === 0) {
      if (regionSliderType === 'globalChangePickupPoint') {
        changeGlobalPickupPoint(null)
        await onDismissSlider()
        return closeRegionSlider()
      }

      return onDismissSlider()
    }

    if (isChangingPickupPoint) {
      changePickupPoint(null)
      regionSliderType === 'globalChangePickupPoint' &&
        changeGlobalPickupPoint(null)
    }

    setSearchState({
      selectedFacets: toggleFacets(
        searchState.selectedFacets,
        selectedPickupInPointFacets,
        true
      ),
      page: 0,
    })

    await onDismissSlider()
    closeRegionSlider()
  }

  const idkPostalCodeLinkProps = useMemo(
    () => ({
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
    }),
    [idkPostalCodeLink]
  )

  if (!isOpen) return null

  const isSameSelectedPickupPoint =
    regionSliderType === 'changePickupPoint' &&
    selectedPickupPointFacet &&
    pickupPointOption === selectedPickupPointFacet
  const isSameGlobalPickupPoint =
    regionSliderType === 'globalChangePickupPoint' &&
    globalPickupPoint &&
    pickupPointOption === globalPickupPoint.id
  const shouldDisableUpdateButton =
    dataLoading ||
    input === '' ||
    input !== appliedInput ||
    pickupPoints?.length === 0 ||
    !pickupPointOption ||
    isSameSelectedPickupPoint ||
    isSameGlobalPickupPoint ||
    regionError !== ''
  const shouldDisableClearButton =
    !dataLoading && !pickupPointOption && !selectedPickupPointFacet

  return (
    <UIFilterSlider
      data-fs-filter-region-slider
      testId="fs-region-slider"
      overlayProps={{
        className: `section ${styles.section} section-filter-slider`,
      }}
      title={
        regionSliderType !== 'none'
          ? cmsData?.deliveryPromise?.regionSlider?.title?.[regionSliderType]
          : ''
      }
      size="partial"
      direction="rightSide"
      onClose={() => onDismissSlider()}
      onDismiss={() => onDismissSlider()}
      footer={isChangingPickupPoint ? true : false}
      applyBtnProps={
        isChangingPickupPoint
          ? {
              variant: 'primary',
              children:
                cmsData?.deliveryPromise?.regionSlider
                  ?.pickupPointChangeApplyButtonLabel,
              disabled: shouldDisableUpdateButton,
              onClick: async () => {
                await handlePickupPointUpdate()

                // Clear local state when leaving the component after setting a pickup point.
                // Pickup points simulation data are reset by the `onPostalCodeChange` callback.
                await onDismissSlider({
                  shouldClearPickupPointsSimulation: false,
                })
              },
            }
          : undefined
      }
      clearBtnProps={
        isChangingPickupPoint
          ? {
              variant: 'secondary',
              disabled: shouldDisableClearButton,
              onClick: () => clearFilter(),
              children:
                cmsData?.deliveryPromise?.regionSlider
                  ?.pickupPointClearFilterButtonLabel ?? 'Clear filter',
            }
          : undefined
      }
    >
      <div data-fs-filter-region-slider-content>
        <span data-fs-filter-region-slider-description>
          {cmsData?.deliveryPromise?.deliveryMethods?.description}
        </span>
        <UIInputField
          id="region-slider-input-field"
          inputRef={inputRef}
          label={inputField?.label}
          actionable
          value={input}
          buttonActionText={dataLoading ? '...' : inputField?.buttonActionText}
          onInput={(e) => {
            setInput(e.currentTarget.value)
            regionError !== '' && setRegionError('')
          }}
          onSubmit={() => handleSubmit()}
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
          !dataLoading && (
            <PickupPointCards
              pickupPoints={regionError ? [] : pickupPoints}
              selectedOption={pickupPointOption}
              onChange={handlePickupPointOnChange}
              noPickupPointsAvailableMessage={
                pickupPoints?.length === 0
                  ? cmsData.deliveryPromise?.regionSlider
                      ?.noPickupPointsAvailableInLocation
                  : undefined
              }
              errorMessage={{
                title: regionError,
                description:
                  cmsData?.regionalization?.inputField?.errorMessageHelper,
              }}
              choosePickupPointAriaLabel={
                cmsData?.deliveryPromise?.regionSlider
                  ?.choosePickupPointAriaLabel
              }
            />
          )}
      </div>
    </UIFilterSlider>
  )
}

export default RegionSlider
