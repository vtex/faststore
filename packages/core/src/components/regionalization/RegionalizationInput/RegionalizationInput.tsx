import { useSession } from '@faststore/sdk'
import { Input as UIInput, Label as UILabel } from '@faststore/ui'
import { gql } from '@vtex/graphql-utils'
import { useRef } from 'react'
import type { KeyboardEvent } from 'react'

import { request } from 'src/sdk/graphql/request'
import type {
  UpdateSessionMutationMutation,
  UpdateSessionMutationMutationVariables,
} from '@generated/graphql'

const POSTAL_CODE_INPUT_ID = 'postal-code-input'

export const UpdateSessionMutation = gql`
  mutation UpdateSessionMutation($session: IStoreSession!) {
    updateSession(session: $session) {
      channel
    }
  }
`

export default function RegionalizationInput() {
  const ref = useRef<HTMLInputElement>(null)
  const { country, setSession, ...partialSession } = useSession()

  const handleSubmit = async (event: KeyboardEvent<HTMLInputElement>) => {
    const value = ref.current?.value

    if (!(event.key === 'Enter' && typeof value === 'string')) {
      return
    }

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
  }

  return (
    <div className="regionalization-input">
      <UILabel htmlFor={POSTAL_CODE_INPUT_ID}>Postal Code: </UILabel>
      <UIInput
        id={POSTAL_CODE_INPUT_ID}
        ref={ref}
        onKeyDown={handleSubmit}
        defaultValue={partialSession.postalCode ?? ''}
      />
    </div>
  )
}
