import { RegionModal as UIRegionModal } from '@faststore/ui'
import { useRef, useState } from 'react'

import { sessionStore, useSession, validateSession } from 'src/sdk/session'

import styles from './section.module.scss'

function RegionModal() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isValidating, ...session } = useSession()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [input, setInput] = useState<string>('')

  const handleSubmit = async () => {
    const postalCode = inputRef.current?.value

    //remove before merge
    const addressType = 'search'
    const country = 'BRA'
    const deliveryMode = {
      deliveryChannel: 'pickup-in-point',
      deliveryMethod: 'pickuppoint (100-200-300-400)',
    }

    if (typeof postalCode !== 'string') {
      return
    }

    setErrorMessage('')

    try {
      const newSession = {
        ...session,
        postalCode,
        addressType,
        deliveryMode,
        country,
      }

      const validatedSession = await validateSession(newSession)

      sessionStore.set(validatedSession ?? newSession)
    } catch (error) {
      setErrorMessage('You entered an invalid Postal Code')
    }
  }

  return (
    <UIRegionModal
      overlayProps={{
        className: `section ${styles.section} section-region-modal`,
      }}
      inputRef={inputRef}
      inputValue={input}
      errorMessage={errorMessage}
      onInput={(e) => {
        errorMessage !== '' && setErrorMessage('')
        setInput(e.currentTarget.value)
      }}
      onSubmit={handleSubmit}
      fadeOutOnSubmit={true}
      onClear={() => setInput('')}
    />
  )
}

export default RegionModal
