import { OutOfStock as UIOutOfStock } from '@faststore/ui'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { useSession } from 'src/sdk/session'

function OutOfStock() {
  const { postalCode } = useSession()

  const [isLoading, setIsLoading] = useState(false)
  const [labelButton, setLabelButton] = useState('Notify Me')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    console.log(event)

    // setDisabled(true)

    try {
    } catch (err) {
    } finally {
      // Return to original state after 2s
      // setTimeout(reset, 2000)
    }
  }

  return (
    <UIOutOfStock
      title={postalCode ? 'Unavailable in Your Location' : 'Out of Stock'}
      inputLabel="Email"
      buttonLabel={labelButton}
      subtitle="Notify me when available"
      onSubmit={handleSubmit}
      disabled={isLoading}
    />
  )
}

export default OutOfStock
