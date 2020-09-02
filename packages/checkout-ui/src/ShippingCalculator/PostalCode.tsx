/** @jsx jsx */
import { FC, Fragment } from 'react'
import { components } from '@vtex/address-form'
import { jsx, Button, Input, Link, Spinner } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

const { CountrySelector, PostalCodeGetter } = components

interface FieldInfo {
  autoComplete: string
  label: string
  maxLength: number
  name: string
  postalCodeAPI: boolean
  size: string
  forgottenURL?: string
}

interface PostalCodeInputProps {
  Button: React.ComponentType<any>
  onSubmit: () => void
  onChange: (postalCode: string) => void
  address: any
  field: FieldInfo
  inputRef: React.RefObject<HTMLInputElement>
  shouldShowNumberKeyboard: boolean
  submitLabel: string
  loading: boolean
}

const PostalCodeInput: FC<PostalCodeInputProps> = ({
  Button: SubmitButton,
  onSubmit,
  address,
  field,
  inputRef,
  shouldShowNumberKeyboard = false,
  submitLabel,
  loading,
  onChange,
  ...props
}) => {
  const intl = useIntl()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    onChange(evt.target.value)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault()

    onSubmit()
  }

  return (
    <form sx={{ display: 'flex' }} onSubmit={handleSubmit}>
      <label sx={{ width: '100%' }}>
        <span
          sx={{
            display: 'inline-block',
            fontSize: '.875rem',
            marginBottom: 2,
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          {intl.formatMessage({ id: `address-form.field.${field.label}` })}
        </span>
        <Input
          {...props}
          value={address[field.name].value ?? ''}
          name={field.name}
          onChange={handleChange}
          disabled={loading}
          ref={inputRef}
        />
      </label>
      <SubmitButton
        variant="secondary"
        disabled={loading}
        sx={{
          flexShrink: 0,
          alignSelf: 'flex-end',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
        }}
        ml={2}
      >
        {loading ? <Spinner size={24} /> : submitLabel}
      </SubmitButton>

      {field.forgottenURL && (
        <Link
          href={field.forgottenURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {intl.formatMessage({ id: 'address-form.dontKnowPostalCode' })}
        </Link>
      )}
    </form>
  )
}

interface Props {
  countries: string[]
  loading: boolean
  onSubmit: () => void
}

export const PostalCode: FC<Props> = ({ countries, loading, onSubmit }) => {
  const intl = useIntl()

  const translatedCountries = countries.map((countryCode: string) => ({
    label: intl.formatMessage({ id: `country.${countryCode}` }),
    value: countryCode,
  }))

  return (
    <Fragment>
      {translatedCountries.length > 1 && (
        <CountrySelector id="country-selector" shipsTo={translatedCountries} />
      )}
      <PostalCodeGetter
        id="postal-code-getter"
        Input={PostalCodeInput}
        Button={Button}
        submitLabel={intl.formatMessage({ id: 'shipping-calculator.estimate' })}
        onSubmit={onSubmit}
        loading={loading}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </Fragment>
  )
}
