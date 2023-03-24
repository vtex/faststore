import { OutOfStock as UIOutOfStock } from '@faststore/ui'

import { useSession } from 'src/sdk/session'

export interface OutOfStockProps {
  /**
   * Event emitted when form is submitted.
   */
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

function OutOfStock({ onSubmit }: OutOfStockProps) {
  const { postalCode } = useSession()

  return (
    <UIOutOfStock
      title={postalCode ? 'Unavailable in Your Location' : 'Out of Stock'}
      inputLabel="Email"
      buttonLabel="Notify Me"
      subtitle="Notify me when available"
      onSubmit={onSubmit}
    />
  )
}

export default OutOfStock
