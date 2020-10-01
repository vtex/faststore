import React, { Fragment, FC } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button } from '@vtex/store-ui'
import {
  AddressRules,
  AddressContainer,
  PostalCodeGetter,
} from '@vtex/address-form'
import { StyleguideInput } from '@vtex/address-form/lib/inputs'

import Preview from './Preview'
import ShippingTable from './ShippingTable'

type Props = {
  variant: string
  skuId?: string
  seller?: string
  country?: string
  loading?: string
  loaderStyles?: string
  onAddress?: string
  address?: any
  isValid?: string
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
    <Fragment>
      <div>
        <AddressRules country={country} shouldUseIOFetching>
          <AddressContainer
            Input={StyleguideInput}
            address={address}
            onChangeAddress={onAddress}
            autoCompletePostalCode
            disabled={loading}
          >
            <PostalCodeGetter onSubmit={onCalculateShipping} />
          </AddressContainer>
        </AddressRules>
        <Button onClick={onCalculateShipping} disabled={!isValid} type="submit">
          {intl.formatMessage({ id: 'store/shipping.label' })}
        </Button>
      </div>
      <ShippingTable shipping={shipping} />
    </Fragment>
  )
}

export default ShippingSimulator
