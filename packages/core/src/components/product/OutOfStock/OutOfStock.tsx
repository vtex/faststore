import { Icon, OutOfStock as UIOutOfStock, useUI } from '@faststore/ui'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { useSession } from 'src/sdk/session'

function OutOfStock() {
  const { postalCode } = useSession()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { pushToast } = useUI()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    // TODO: Missing integration

    try {
      // Return to original state after 2s mockup
      setTimeout(() => setIsLoading(false), 2000)

      const formElement = event.currentTarget as HTMLFormElement
      formElement.reset()

      pushToast({
        title: 'Subscribed successfully!',
        message: "You'll be notified when this product is back to stock.",
        status: 'INFO',
        icon: <Icon name="CircleWavyCheck" width={30} height={30} />,
      })
    } catch (err) {
      setError(err.message)
    } finally {
    }
  }

  return (
    <UIOutOfStock
      title={postalCode ? 'Unavailable in Your Location' : 'Out of Stock'}
      inputLabel="Email"
      subtitle="Notify me when available"
      onSubmit={handleSubmit}
      disabled={isLoading}
      errorMessage={error}
    />
  )
}

export default OutOfStock
