import { PropsWithChildren } from 'react'
import { Button } from '@faststore/ui'

// TODO: Remove this component when <OutOfStock /> is ready to use
function NotAvailableButton({ children }: PropsWithChildren) {
  return (
    <Button variant="primary" disabled data-fs-buy-button>
      {children}
    </Button>
  )
}

export default NotAvailableButton
