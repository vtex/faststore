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
      title="Out of Stock"
      buttonText="Notify Me"
      buttonSuccess="Subscribed successfully"
      notificationMsg="Notify me when available"
      inputLabel="Email"
      titleSession="Unavailable in Your Location"
      sessionPostalCode={postalCode}
      onSubmit={onSubmit}
    />
  )
}

export default OutOfStock
