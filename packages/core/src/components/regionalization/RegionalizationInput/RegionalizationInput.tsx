import { useSession } from '@faststore/sdk'
import { gql } from '@vtex/graphql-utils'
import { useRef, useState } from 'react'

import { request } from 'src/sdk/graphql/request'
import type {
  UpdateSessionMutationMutation,
  UpdateSessionMutationMutationVariables,
} from '@generated/graphql'
import InputText from 'src/components/ui/InputText'
import { useModal } from 'src/sdk/ui/modal/Provider'

export const UpdateSessionMutation = gql`
  mutation UpdateSessionMutation($session: IStoreSession!) {
    updateSession(session: $session) {
      channel
    }
  }
`

export default function RegionalizationInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { country, setSession, ...partialSession } = useSession()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { onModalClose } = useModal()

  const handleSubmit = async () => {
    const value = inputRef.current?.value

    if (typeof value !== 'string') {
      return
    }

    setErrorMessage('')

    try {
      const {
        updateSession: { channel },
      } = await request<
        UpdateSessionMutationMutation,
        UpdateSessionMutationMutationVariables
      >(UpdateSessionMutation, {
        session: {
          channel: partialSession.channel,
          postalCode: value,
          country,
        },
      })

      setSession({
        postalCode: value,
        channel: channel ?? partialSession.channel,
      })

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
