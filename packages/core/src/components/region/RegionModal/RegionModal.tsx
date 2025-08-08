import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'

import type { RegionModalProps as UIRegionModalProps } from '@faststore/ui'
import { Icon, useUI } from '@faststore/ui'

import { deliveryPromise } from 'faststore-config'
import { useDeliveryPromise } from '../../../sdk/deliveryPromise'
import { useSession } from '../../../sdk/session'

import useRegion from './useRegion'

import { getGlobalSettings } from '../../../utils/globalSettings'
import styles from './section.module.scss'

const UIRegionModal = dynamic<UIRegionModalProps>(
  () =>
    import(/* webpackChunkName: "UIRegionModal" */ '@faststore/ui').then(
      (mod) => mod.RegionModal
    ),
  { ssr: false }
)
interface RegionModalProps {
  title?: UIRegionModalProps['title']
  description?: UIRegionModalProps['description']
  closeButtonAriaLabel?: UIRegionModalProps['closeButtonAriaLabel']
  inputField?: {
    label?: UIRegionModalProps['inputLabel']
    errorMessage?: UIRegionModalProps['errorMessage']
    noProductsAvailableErrorMessage?: UIRegionModalProps['errorMessage']
    buttonActionText?: UIRegionModalProps['inputButtonActionText']
  }
  idkPostalCodeLink?: {
    text?: string
    to?: string
    icon?: {
      icon?: string
      alt: string
    }
  }
}

function RegionModal(regionModalProps: RegionModalProps) {
  const { onPostalCodeChange } = useDeliveryPromise()
  const { title, description, closeButtonAriaLabel, ...otherRegionModalProps } =
    regionModalProps
  const cmsData = getGlobalSettings(otherRegionModalProps)
  const {
    inputField: {
      label: inputFieldLabel = '',
      errorMessage: inputFieldErrorMessage = '',
      noProductsAvailableErrorMessage:
        inputFieldNoProductsAvailableErrorMessage = '',
      buttonActionText: inputButtonActionText = '',
    } = {},
    idkPostalCodeLink: {
      text: idkPostalCodeLinkText = '',
      to: idkPostalCodeLinkTo = '',
      icon: {
        icon: idkPostalCodeLinkIcon = '',
        alt: idkPostalCodeLinkIconAlt = '',
      } = {},
    } = {},
  } = cmsData?.regionalization ?? {}

  const inputRef = useRef<HTMLInputElement>(null)
  const { isValidating, ...session } = useSession()
  const { modal: displayModal, closeModal } = useUI()

  const [input, setInput] = useState<string>('')

  const { loading, setRegion, regionError, setRegionError } = useRegion()

  const handleSubmit = async () => {
    if (isValidating) {
      return
    }

    await setRegion({
      session,
      onSuccess: () => {
        onPostalCodeChange()
        setInput('')
        closeModal()
      },
      postalCode: input,
      errorMessage: inputFieldErrorMessage,
      noProductsAvailableErrorMessage:
        inputFieldNoProductsAvailableErrorMessage,
    })
  }

  const isDismissible = !!(!deliveryPromise?.mandatory || session.postalCode)
  const idkPostalCodeLinkProps: UIRegionModalProps['idkPostalCodeLinkProps'] = {
    href: idkPostalCodeLinkTo,
    children: (
      <>
        {idkPostalCodeLinkText}
        {!!idkPostalCodeLinkIcon && (
          <Icon
            name={idkPostalCodeLinkIcon}
            aria-label={idkPostalCodeLinkIconAlt}
            width={20}
            height={20}
          />
        )}
      </>
    ),
  }

  return (
    <>
      {displayModal && (
        <UIRegionModal
          title={title}
          description={description}
          overlayProps={{
            className: `section ${styles.section} section-region-modal`,
          }}
          closeButtonAriaLabel={closeButtonAriaLabel}
          inputRef={inputRef}
          inputValue={input}
          inputLabel={inputFieldLabel}
          errorMessage={regionError}
          idkPostalCodeLinkProps={
            idkPostalCodeLinkTo ? idkPostalCodeLinkProps : null
          }
          onInput={(e) => {
            regionError !== '' && setRegionError('')
            setInput(e.currentTarget.value)
          }}
          onSubmit={handleSubmit}
          fadeOutOnSubmit={false}
          onClear={() => {
            setInput('')
            setRegionError('')
          }}
          inputButtonActionText={loading ? '...' : inputButtonActionText}
          dismissible={isDismissible}
        />
      )}
    </>
  )
}

RegionModal.$componentKey = 'RegionModal'

export default RegionModal
