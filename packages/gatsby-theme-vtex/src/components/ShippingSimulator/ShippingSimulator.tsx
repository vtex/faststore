import React, { FC } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button, Box } from '@vtex/store-ui'
import {
  AddressContainer,
  AddressRules,
  PostalCodeGetter,
} from '@vtex/address-form'
import DefaultInput from '@vtex/address-form/lib/inputs/DefaultInput'

import Preview from './Preview'
import ShippingTable from './ShippingTable'

// const { AddressContainer, AddressRules, PostalCodeGetter } = components

type Props = {
  variant: string
  skuId: string
  seller: string
  country: string
  loading: boolean
  onAddress?: (address: any) => void
  address?: any
  isValid: boolean
  onCalculateShipping?: () => void
  shipping?: any
}

const ShippingSimulator: FC<Props> = ({
  variant,
  skuId,
  seller,
  country,
  loading,
  onAddress,
  address,
  isValid,
  onCalculateShipping,
  shipping,
}) => {
  const intl = useIntl()

  if (!seller || !skuId) {
    return <Preview variant={variant} />
  }

  return (
    <Box variant={`${variant}.container`}>
      <Box variant={`${variant}.fieldContainer`}>
        <AddressRules
          country={country}
          fetch={() => import(`@vtex/address-form/lib/country/${country}`)}
        >
          <AddressContainer
            Input={DefaultInput}
            address={address}
            onChangeAddress={onAddress}
            autoCompletePostalCode
            disabled={loading}
          >
            <PostalCodeGetter onSubmit={onCalculateShipping} />
          </AddressContainer>
        </AddressRules>
        <Button
          variant={`${variant}.button`}
          disabled={!isValid || loading}
          onClick={onCalculateShipping}
          type="submit"
        >
          {intl.formatMessage({ id: 'shippingSimulator.label' })}
        </Button>
      </Box>
      {loading && <Preview />}
      {shipping && <ShippingTable shipping={shipping} variant={variant} />}
    </Box>
  )
}

export default ShippingSimulator
