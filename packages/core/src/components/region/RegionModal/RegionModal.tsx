import dynamic from 'next/dynamic'
import { useRef } from 'react'

import type { RegionModalProps as UIRegionModalProps } from '@faststore/ui'
import { Icon, useUI } from '@faststore/ui'

import { deliveryPromise } from 'discovery.config'
import { useSession } from 'src/sdk/session'

import { useSetLocation } from './useSetLocation'

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

function RegionModal({
  title,
  description,
  closeButtonAriaLabel,
  inputField: {
    label: inputFieldLabel,
    errorMessage: inputFieldErrorMessage,
    buttonActionText: inputButtonActionText,
  },
  idkPostalCodeLink: {
    text: idkPostalCodeLinkText,
    to: idkPostalCodeLinkTo,
    icon: { icon: idkPostalCodeLinkIcon, alt: idkPostalCodeLinkIconAlt },
  },
}: RegionModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isValidating, ...session } = useSession()
  const { modal: displayModal, closeModal } = useUI()

  const {
    input,
    setInput,
    handleSubmit: setLocation,
    resetInputField,
    loading,
    errorMessage,
    setErrorMessage,
  } = useSetLocation()

  const isDismissible = !!(!deliveryPromise?.mandatory || session.postalCode)

  const handleSubmit = async () => {
    if (isValidating) {
      return
    }

    await setLocation(
      inputRef.current?.value,
      inputFieldErrorMessage,
      session,
      closeModal
    )
  }

  const idkPostalCodeLinkProps: UIRegionModalProps['idkPostalCodeLinkProps'] = {
    href: idkPostalCodeLinkTo ?? '#',
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
          errorMessage={errorMessage}
          idkPostalCodeLinkProps={idkPostalCodeLinkProps}
          onInput={(e) => {
            errorMessage !== '' && setErrorMessage('')
            setInput(e.currentTarget.value)
          }}
          onSubmit={handleSubmit}
          fadeOutOnSubmit={false}
          onClear={resetInputField}
          inputButtonActionText={loading ? '...' : inputButtonActionText}
          dismissible={isDismissible}
        />
      )}
    </>
  )
}

export default RegionModal
