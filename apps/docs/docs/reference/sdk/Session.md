---
id: session
keywords: [session, regionalization]
---

# Session

The FastStore SDK session module manages the state of session information in the shopper's browser. This includes currency, channel, localization and shopper data.

## Session object structure

Below you can see details of the session data managed by the session SDK module.

### Session

| **Field**    | **Type** | **Description**                                               |
| ------------ | -------- | ------------------------------------------------------------- |
| `locale`     | String   | Session locale (e.g., "en-US").                               |
| `currency`   | Object   | Session currency object. See fields details below.            |
| `country`    | String   | Session country three letter ISO code (e.g., "BRA").          |
| `channel`    | String   | Session channel.                                              |
| `postalCode` | String   | Session postal code.                                          |
| `person`     | Object   | Session shopper information object. See fields details below. |

#### Currency

| **Field** | **Type** | **Description**                           |
| --------- | -------- | ----------------------------------------- |
| `code`    | String   | Currency three letter code (e.g., "USD"). |
| `symbol`  | String   | Currency symbol (e.g., "$").              |

#### Person

| **Field**    | **Type** | **Description**                                         |
| ------------ | -------- | ------------------------------------------------------- |
| `id`         | String   | Shopper ID in case it exists in the ecommerce platform. |
| `email`      | String   | Email address provided by the shopper.                  |
| `givenName`  | String   | Shopper given name.                                     |
| `familyName` | String   | Shopper family name.                                    |

## Usage

The session SDK module exports a `createSessionStore` function and `Session` type, which you can import like this:

```ts
import { createSessionStore } from '@faststore/sdk'
import type { Session } from '@faststore/sdk'
```

See in the example below how these are used in the [Next.js store](https://github.com/vtex-sites/nextjs.store) to export other functions that update session information and validate them with the [FastStore API](https://www.faststore.dev/reference/api/faststore-api).

```ts
//src/sdk/session/index.ts

import { gql } from '@faststore/graphql-utils'
import { createSessionStore } from '@faststore/sdk'
import { useMemo } from 'react'
import type { Session } from '@faststore/sdk'

import storeConfig from 'store.config'

import { cartStore } from '../cart'
import { request } from '../graphql/request'
import { createValidationStore, useStore } from '../useStore'
import type {
  ValidateSessionMutation,
  ValidateSessionMutationVariables,
} from '../../../@generated/graphql/index'

export const mutation = gql`
  mutation ValidateSession($session: IStoreSession!, $search: String!) {
    validateSession(session: $session, search: $search) {
      locale
      channel
      country
      postalCode
      currency {
        code
        symbol
      }
      person {
        id
        email
        givenName
        familyName
      }
    }
  }
`

export const validateSession = async (session: Session) => {
  const data = await request<
    ValidateSessionMutation,
    ValidateSessionMutationVariables
  >(mutation, { session, search: window.location.search })

  return data.validateSession
}

const [validationStore, onValidate] = createValidationStore(validateSession)

const defaultStore = createSessionStore(storeConfig.session, onValidate)

export const sessionStore = {
  ...defaultStore,
  set: (val: Session) => {
    defaultStore.set(val)

    // Trigger cart revalidation when session changes
    cartStore.set(cartStore.read())
  },
}

export const useSession = () => {
  const session = useStore(sessionStore)
  const isValidating = useStore(validationStore)

  return useMemo(
    () => ({
      ...session,
      isValidating,
    }),
    [isValidating, session]
  )
}
```

Because of this, if you use one of the [Base Store starters](https://www.faststore.dev/starters/base), you have access to `sessionStore`, `useSession` and `validateSession`.

See the example below to learn more about how these are used in the [Next.js store](https://github.com/vtex-sites/nextjs.store) to update session data according to shopper regionalization input.

```ts
//src/components/regionalization/RegionalizationInput/RegionalizationInput.tsx

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
```
