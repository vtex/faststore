import { useSearch } from '@faststore/sdk'
import {
  useUI,
  type FilterSliderProps as UIFilterSliderProps,
  type IconProps as UIIconProps,
  type InputFieldProps as UIInputFieldProps,
} from '@faststore/ui'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import useRegion from 'src/components/region/RegionModal/useRegion'
import StoreCards from 'src/components/ui/StoreCards'
import { useSession } from 'src/sdk/session'
import type { RegionalizationCmsData } from 'src/utils/globalSettings'
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

type RegionSliderProps = {
  cmsData: RegionalizationCmsData
}

function RegionSlider({ cmsData }: RegionSliderProps) {
  const {
    regionSlider: { type: regionSliderType },
    closeRegionSlider,
  } = useUI()
  const inputRef = useRef<HTMLInputElement>(null)
  const { isValidating, ...session } = useSession()
  const { loading, setRegion, regionError, setRegionError } = useRegion()

  const [input, setInput] = useState<string>(session.postalCode ?? '')

  const inputField = cmsData?.inputField
  const idkPostalCodeLink = cmsData?.idkPostalCodeLink

  const handleSubmit = async () => {
    if (isValidating) {
      return
    }

    await setRegion({
      session,
      onSuccess: () => {
        if (regionSliderType !== 'changeStore') {
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

  const { state } = useSearch()

  const pickupPointSelected = state.selectedFacets.find(
    (facet) => facet.key === 'pickupPoint'
  )?.value

  console.log('RegionSlider state:', state)

  const [pickupPointOption, setPickupPointOption] = useState<string | null>(
    pickupPointSelected ?? null
  )
  const handlePickupPointChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPickupPointOption(event.target.value)
    console.log('Selected pickup point:', event.target.value)
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
          ? cmsData?.deliverySettings?.postalCodeEditSlider?.[regionSliderType]
          : ''
      }
      size="partial"
      direction="rightSide"
      onClose={() => {}}
      footer={regionSliderType === 'changeStore' ? true : false}
      applyBtnProps={
        regionSliderType === 'changeStore'
          ? {
              variant: 'primary',
              children: 'Update',
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
            regionError !== '' && setRegionError('')
            setInput(e.currentTarget.value)
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

        {regionSliderType === 'changeStore' && (
          <StoreCards
            selectedOption={pickupPointOption}
            onChange={handlePickupPointChange}
          />
        )}
      </div>
    </UIFilterSlider>
  )
}

export default RegionSlider
