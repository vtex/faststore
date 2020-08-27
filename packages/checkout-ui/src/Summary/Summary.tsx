import React, { FC } from 'react'
import { Heading, Box, Flex } from '@vtex/store-ui'

import { SummaryContextProvider } from './SummaryContext'

interface InsertCouponResult {
  success: boolean
  errorKey: string
}

export interface SummaryProps {
  coupon?: string
  insertCoupon?: (coupon: string) => Promise<InsertCouponResult>
  loading?: boolean
  totalizers: any[]
  total: number
}

export const Summary: FC<SummaryProps & { title: string }> = ({
  children,
  loading,
  totalizers,
  total,
  coupon,
  insertCoupon,
  title,
}) => {
  return (
    <SummaryContextProvider
      coupon={coupon}
      insertCoupon={insertCoupon}
      loading={loading}
      totalizers={totalizers}
      total={total}
    >
      <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading mt={0} mb={3} sx={{ fontSize: '1.25rem', fontWeight: 400 }}>
          {title}
        </Heading>
      </Flex>
      <Box sx={{ color: 'text' }}>{children}</Box>
    </SummaryContextProvider>
  )
}
