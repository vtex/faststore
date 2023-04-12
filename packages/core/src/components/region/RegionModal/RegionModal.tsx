import { useRef, useState } from 'react'
import { RegionModal as UIRegionModal } from '@faststore/ui'

import { sessionStore, useSession, validateSession } from 'src/sdk/session'

function RegionModal() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isValidating, ...session } = useSession()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [input, setInput] = useState<string>('')

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

      sessionStore.set(validatedSession ?? newSession)
    } catch (error) {
      setErrorMessage('You entered an invalid Postal Code')
    }
  }

  return (
    <UIRegionModal
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
