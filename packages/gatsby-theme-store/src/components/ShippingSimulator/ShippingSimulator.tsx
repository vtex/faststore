import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, Button, Text } from '@vtex/store-ui'
import React from 'react'
import type { FC, FormEvent } from 'react'

import PostalCodeInput from './PostalCodeInput'
import Preview from './Preview'
import ShippingTable from './ShippingTable'

type Props = {
  variant: string
  skuId: string
  seller: string
  country: string
  loading: boolean
  onPostalCode: (data: string) => void
  postalCode?: string
  isValid: boolean
  onCalculateShipping?: () => void
  shipping?: any
}

const ShippingSimulator: FC<Props> = ({
  variant,
  skuId,
  seller,
  loading,
  isValid,
  onCalculateShipping,
  onPostalCode,
  postalCode,
  shipping,
}) => {
  const intl = useIntl()

  if (!seller || !skuId) {
    return <Preview variant={variant} />
  }

  return (
    <Box variant={`${variant}.container`}>
      <Box
        as="form"
        variant={`${variant}.fieldContainer`}
        onSubmit={(e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          onCalculateShipping?.()
        }}
      >
        <label htmlFor="postalCode">
          <Text variant={`${variant}.inputLabel`}>
            {intl.formatMessage({ id: 'shipping.postalCodeLabel' })}
          </Text>

          <PostalCodeInput
            variant={`${variant}.input`}
            id="postalCode"
            name="postalCode"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onPostalCode(e.target.value)
            }}
            value={postalCode}
          />
        </label>
        <Button
          variant={`${variant}.button`}
          disabled={!isValid || loading}
          type="submit"
        >
          {intl.formatMessage({ id: 'shippingSimulator.label' })}
        </Button>
      </Box>
      {loading && <Preview variant={`${variant}.preview`} />}
      {shipping && !loading && (
        <ShippingTable shipping={shipping} variant={`${variant}.table`} />
      )}
    </Box>
  )
}

export default ShippingSimulator
