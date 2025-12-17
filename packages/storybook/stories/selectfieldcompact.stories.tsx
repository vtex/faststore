import React, { useState } from 'react'
import { SelectFieldCompact } from '@faststore/components'

export default {
  title: 'SelectFieldCompact',
}

const countryOptions = {
  '': 'Select a country',
  us: 'United States',
  ca: 'Canada',
  mx: 'Mexico',
  br: 'Brazil',
  ar: 'Argentina',
  uk: 'United Kingdom',
  fr: 'France',
  de: 'Germany',
  es: 'Spain',
  it: 'Italy',
}

const sizeOptions = {
  '': 'Select size',
  xs: 'Extra Small',
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'Extra Large',
}

export function Default() {
  const [value, setValue] = useState('')

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <SelectFieldCompact
        id="select-default"
        label="Select label..."
        options={countryOptions}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

export function WithValue() {
  const [value, setValue] = useState('us')

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <SelectFieldCompact
        id="select-with-value"
        label="Country"
        options={countryOptions}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

export function WithError() {
  const [value, setValue] = useState('')

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <SelectFieldCompact
        id="select-error"
        label="Country"
        options={countryOptions}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error="Please select a valid country"
      />
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <SelectFieldCompact
        id="select-disabled"
        label="Country"
        options={countryOptions}
        value="us"
        disabled
      />
    </div>
  )
}

export function Loading() {
  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <SelectFieldCompact
        id="select-loading"
        label="Loading options..."
        options={countryOptions}
        value=""
        loading
      />
    </div>
  )
}

export function MultipleStates() {
  const [country, setCountry] = useState('')
  const [size, setSize] = useState('m')

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <SelectFieldCompact
        id="select-default-state"
        label="Select label..."
        options={countryOptions}
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <SelectFieldCompact
        id="select-with-value-state"
        label="Size"
        options={sizeOptions}
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />

      <SelectFieldCompact
        id="select-error-state"
        label="Country (Required)"
        options={countryOptions}
        value=""
        error="This field is required"
      />

      <SelectFieldCompact
        id="select-disabled-state"
        label="Unavailable"
        options={countryOptions}
        value="us"
        disabled
      />

      <SelectFieldCompact
        id="select-loading-state"
        label="Loading..."
        options={countryOptions}
        value=""
        loading
      />
    </div>
  )
}

export function WithValidation() {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const error = touched && !value ? 'Please select an option' : undefined

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <SelectFieldCompact
        id="select-validation"
        label="Country (Required)"
        options={countryOptions}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        error={error}
      />
      <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
        {value
          ? `Selected: ${countryOptions[value as keyof typeof countryOptions]}`
          : 'No selection'}
      </p>
    </div>
  )
}

export function DifferentSizes() {
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ width: '200px' }}>
        <SelectFieldCompact
          id="select-small"
          label="Size"
          options={sizeOptions}
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
        />
      </div>

      <div style={{ width: '400px' }}>
        <SelectFieldCompact
          id="select-large"
          label="Country"
          options={countryOptions}
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
        />
      </div>
    </div>
  )
}
