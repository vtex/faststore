import React, { FC, Fragment } from 'react'
import { components } from '@vtex/address-form'
import { Button } from '@vtex/store-ui'

const { CountrySelector, PostalCodeGetter } = components

interface Props {
  countries: string[]
  loading: boolean
  handleSubmit: () => void
}

export const PostalCode: FC<Props> = ({ countries, loading, handleSubmit }) => {
  const translatedCountries = countries.map((countryCode: string) => ({
    label: countryCode,
    value: countryCode,
  }))

  return (
    <Fragment>
      {translatedCountries.length > 1 && (
        <CountrySelector id="country-selector" shipsTo={translatedCountries} />
      )}
      <PostalCodeGetter
        id="postal-code-getter"
        Button={Button}
        submitLabel="estimate"
        onSubmit={handleSubmit}
        loading={loading}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </Fragment>
  )
}
