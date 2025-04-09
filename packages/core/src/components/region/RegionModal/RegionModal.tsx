import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'

import type { RegionModalProps as UIRegionModalProps } from '@faststore/ui'
import { Icon, useUI } from '@faststore/ui'

import { deliveryPromise } from 'discovery.config'
import { sessionStore, useSession, validateSession } from 'src/sdk/session'

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
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { modal: displayModal, closeModal } = useUI()

  const isDismissible = !!(!deliveryPromise?.mandatory || session.postalCode)

  const resetInputField = () => {
    setInput('')
    setErrorMessage('')
  }

  const handleSubmit = async () => {
    const postalCode = inputRef.current?.value

    if (typeof postalCode !== 'string') {
      return
    }

    setErrorMessage('')
    setLoading(true)

    try {
      const newSession = {
        ...session,
        postalCode,
        geoCoordinates: null, // Revalidate geo coordinates in API when users set a new postal code
      } as typeof session

      const validatedSession = await validateSession(newSession)

      sessionStore.set(validatedSession ?? newSession)
      resetInputField()
      closeModal() // Close modal after successfully applied postal code
    } catch (error) {
      setErrorMessage(inputFieldErrorMessage)
    } finally {
      setLoading(false) // Reset loading to false when validation is complete
    }
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
