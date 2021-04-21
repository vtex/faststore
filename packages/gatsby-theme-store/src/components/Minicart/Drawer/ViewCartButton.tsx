import React from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button, Center, Spinner } from '@vtex/store-ui'

import { useOrderQueueStatus } from '../../../sdk/orderForm/useQueueStatus'

interface Props {
  variant: string
}

export const ViewCartButton = ({ variant }: Props) => {
  const { formatMessage } = useIntl()
  const queueStatus = useOrderQueueStatus()
  const orderFormIsLoading = queueStatus === 'Pending'

  return (
    <Button
      disabled={orderFormIsLoading}
      variant={`${variant}.checkout`}
      onClick={(e) => {
        e.preventDefault()
        window.location.href = '/checkout/'
      }}
    >
      {orderFormIsLoading ? (
        <Center>
          <Spinner size="24px" variant={`${variant}.checkout.spinner`} />
        </Center>
      ) : (
        formatMessage({ id: 'minicart.drawer.go-checkout' })
      )}
    </Button>
  )
}
