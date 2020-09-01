/** @jsx jsx */
import { FC, Fragment } from 'react'
import { components } from '@vtex/address-form'
import { jsx, Button, Input } from '@vtex/store-ui'

const { CountrySelector, PostalCodeGetter } = components

interface FieldInfo {
  autoComplete: string
  label: string
  maxLength: number
  name: string
  postalCodeAPI: boolean
  size: string
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
          {field.label}
        </span>
        <Input
          {...props}
          name={field.name}
          onChange={handleChange}
          disabled={loading}
          ref={inputRef}
        />
      </label>
      <SubmitButton
        variant="secondary"
        disabled={loading}
        sx={{ flexShrink: 0, alignSelf: 'flex-end', marginBottom: '1px' }}
        ml={2}
      >
        {submitLabel}
      </SubmitButton>
    </form>
  )
}

interface Props {
  countries: string[]
  loading: boolean
  onSubmit: () => void
}

export const PostalCode: FC<Props> = ({ countries, loading, onSubmit }) => {
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
        Input={PostalCodeInput}
        Button={Button}
        submitLabel="estimate"
        onSubmit={onSubmit}
        loading={loading}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </Fragment>
  )
}
