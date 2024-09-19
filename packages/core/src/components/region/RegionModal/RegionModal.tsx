import { Suspense, useRef, useState } from 'react'

import {
  Icon,
  RegionModal as UIRegionModal,
  RegionModalProps as UIRegionModalProps,
  useUI,
} from '@faststore/ui'
import type { Session } from '@faststore/sdk'

import { sessionStore, useSession, validateSession } from 'src/sdk/session'
import { setCookie } from 'src/utils/cookies'

import styles from './section.module.scss'

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
  const { modal: displayModal } = useUI()

  async function setRegionIdCookie(session: Session) {
    const THIRTY_DAYS_S = 30 * 24 * 3600
    const channel = JSON.parse(session.channel ?? 'null')

    setCookie('fs_regionid', channel?.regionId as string, THIRTY_DAYS_S)
  }

  const handleSubmit = async () => {
    const postalCode = inputRef.current?.value

    if (typeof postalCode !== 'string') {
      return
    }

    setErrorMessage('')

    try {
      const newSession = {
        ...session,
        postalCode,
      }

      const validatedSession = await validateSession(newSession)

      // Set cookie for the regionId
      await setRegionIdCookie(validatedSession ?? newSession)

      sessionStore.set(validatedSession ?? newSession)
    } catch (error) {
      setErrorMessage(inputFieldErrorMessage)
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
        <Suspense fallback={null}>
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
            fadeOutOnSubmit={true}
            onClear={() => setInput('')}
          />
        </Suspense>
      )}
    </>
  )
}

export default RegionModal
