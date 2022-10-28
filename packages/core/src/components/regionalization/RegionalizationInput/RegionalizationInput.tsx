import { useRef, useState } from 'react'

import InputText from 'src/components/ui/InputText'
import { sessionStore, useSession, validateSession } from 'src/sdk/session'

interface Props {
  closeModal: () => void
}

function RegionInput({ closeModal }: Props) {
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

      closeModal()
    } catch (error) {
      setErrorMessage('You entered an invalid Postal Code')
    }
  }

  return (
    <div className="regionalization-input">
      <InputText
        inputRef={inputRef}
        id="postal-code-input"
        error={errorMessage}
        label="Postal Code"
        actionable
        value={input}
        onInput={(e) => {
          errorMessage !== '' && setErrorMessage('')
          setInput(e.currentTarget.value)
        }}
        onSubmit={handleSubmit}
        onClear={() => setInput('')}
      />
    </div>
  )
}

export default RegionInput
