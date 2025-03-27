import {
  Icon,
  type RegionModalProps as UIRegionModalProps,
  useUI,
} from '@faststore/ui'
import { useRef, useState } from 'react'

import { sessionStore, useSession, validateSession } from 'src/sdk/session'

import { deliveryPromise } from 'discovery.config'

import dynamic from 'next/dynamic'
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
  inputField: { label: inputFieldLabel, errorMessage: inputFieldErrorMessage },
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

  const mandatory = deliveryPromise.mandatory && !session.postalCode

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
      setInput('')
      setErrorMessage('')
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
          onClear={() => {
            setInput('')
            setErrorMessage('')
          }}
          inputButtonActionText={loading ? '...' : 'Apply'}
          preventClose={mandatory}
        />
      )}
    </>
  )
}

export default RegionModal
