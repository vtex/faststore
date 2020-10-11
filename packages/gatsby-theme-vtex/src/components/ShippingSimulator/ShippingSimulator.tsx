import React, { FC } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button, Box, Text } from '@vtex/store-ui'

import Preview from './Preview'
import ShippingTable from './ShippingTable'
import PostalCodeInput from './PostalCodeInput'

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
        onSubmit={(e) => {
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
            onChange={(e) => onPostalCode(e.target.value)}
            value={postalCode}
            required
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
      {loading && <Preview variant={variant} />}
      {shipping && !loading && (
        <ShippingTable shipping={shipping} variant={variant} />
      )}
    </Box>
  )
}

export default ShippingSimulator
