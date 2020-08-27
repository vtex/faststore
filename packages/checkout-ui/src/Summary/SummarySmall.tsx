import React, { FunctionComponent } from 'react'
import { Box, Text } from '@vtex/store-ui'

import { SummaryContextProvider } from './SummaryContext'

interface Props {
  totalizers: any[]
  total: number
  totalizersToShow: string[]
}

export const SummarySmall: FunctionComponent<Props> = ({
  total,
  children,
  totalizers,
  totalizersToShow = ['Items'],
}) => {
  const filteredTotalizers = totalizers.filter((totalizer) =>
    totalizersToShow.includes(totalizer.id)
  )

  return (
    <SummaryContextProvider totalizers={filteredTotalizers} total={total}>
      <Box sx={{ color: 'text' }}>{children}</Box>
      <Text
        sx={{
          marginTop: '.75rem',
          marginBottom: '.75rem',
          fontSize: '.875rem',
          fontWeight: 400,
        }}
        as="span"
      >
        Shipping and taxes calculated at checkout.
      </Text>
    </SummaryContextProvider>
  )
}
