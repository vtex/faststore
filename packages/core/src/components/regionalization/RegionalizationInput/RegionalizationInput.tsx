import { useSession } from '@faststore/sdk'
import { useRef, useState } from 'react'

import InputText from 'src/components/ui/InputText'
import { validateSession } from 'src/sdk/session/validate'
import { useModal } from 'src/sdk/ui/modal/Provider'

export default function RegionalizationInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { setSession, ...session } = useSession()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { onModalClose } = useModal()

  const handleSubmit = async () => {
    const value = inputRef.current?.value

    if (typeof value !== 'string') {
      return
    }

    setErrorMessage('')

    try {
      const newSession = await validateSession({
        ...session,
        postalCode: value,
      })

      if (newSession) {
        setSession(newSession)
      }

      onModalClose()
    } catch (error) {
      setErrorMessage('You entered an invalid Zip Code')
    }
  }

  return (
    <div className="regionalization-input">
      <InputText
        inputRef={inputRef}
        id="postal-code-input"
        errorMessage={errorMessage}
        label="Zip Code"
        actionable
        onSubmit={handleSubmit}
      />
    </div>
  )
}
