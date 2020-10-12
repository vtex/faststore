import React, { FC, useRef, useState } from 'react'
import { Alert, Box, Button, Input } from '@vtex/store-ui'

import { isValidEmail } from '../../../sdk/auth/validate'
import { sendAccessKey, startLogin } from '../../../sdk/auth/Service'

interface Props {
  variant: string
}

const EmailVerification: FC<Props> = ({ variant: v }) => {
  const [badEmail, setBadEmail] = useState(false)
  const [authError, setAuthError] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const variant = `emailVerification.${v}`

  return (
    <>
      <Box variant={`${variant}.title`}>Receive access code by e-mail</Box>
      <Box
        as="form"
        onSubmit={async (e) => {
          e.preventDefault()
          const email = input.current?.value

          setAuthError(false)
          setBadEmail(false)

          if (!email || !isValidEmail(email)) {
            setBadEmail(true)

            return
          }

          try {
            console.log('startLogin', await startLogin({ user: email }))
            console.log('sendAccessKey', await sendAccessKey({ email }))
          } catch (err) {
            setAuthError(true)
            console.log(err)
          }
        }}
        variant={variant}
      >
        <Input
          ref={input}
          type="email"
          name="email"
          id="email"
          placeholder="Eg: example@gmail.com"
        />
        {badEmail && (
          <Alert variant="secondary" mb={2}>
            Sign in with a valid e-mail
          </Alert>
        )}
        {authError && (
          <Alert variant="secondary" mb={2}>
            Signing in failed. Please try again later
          </Alert>
        )}

        <Button>Send</Button>
      </Box>
    </>
  )
}

export default EmailVerification
