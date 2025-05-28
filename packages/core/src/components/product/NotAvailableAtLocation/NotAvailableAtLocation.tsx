import type { PropsWithChildren } from 'react'
import { Label } from '@faststore/ui'

function NotAvailableAtLocation({
  label,
  description,
  ...props
}: PropsWithChildren<{
  label?: string
  description?: string
}>) {
  return (
    <div {...props} data-fs-product-not-available-at-location>
      <Label data-not-available-at-location-label>{label}</Label>
      <span data-not-available-at-location-description>{description}</span>
    </div>
  )
}

export default NotAvailableAtLocation
