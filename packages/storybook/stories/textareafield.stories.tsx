import React, { useState } from 'react'
import { TextareaField } from '@faststore/components'

export default {
  title: 'TextareaField',
}

export function Default() {
  const [value, setValue] = useState('')

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <TextareaField
        id="textarea-default"
        label="Comments"
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
      <TextareaField
        id="textarea-error"
        label="Message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error="This field is required"
      />
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <TextareaField
        id="textarea-disabled"
        label="Description"
        value="This field is disabled"
        disabled
      />
    </div>
  )
}

export function WithPlaceholder() {
  const [value, setValue] = useState('')

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <TextareaField
        id="textarea-placeholder"
        label="Notes"
        placeholder="Type your notes here..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

export function WithMaxLength() {
  const [value, setValue] = useState('')

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <TextareaField
        id="textarea-maxlength"
        label="Short description"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={100}
      />
      <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
        {value.length}/100 characters
      </p>
    </div>
  )
}

export function LargeText() {
  const [value, setValue] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  )

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <TextareaField
        id="textarea-large"
        label="Long text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={8}
      />
    </div>
  )
}

export function WithConditionalError() {
  const [value, setValue] = useState('')
  const minLength = 10

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <TextareaField
        id="textarea-conditional-error"
        label="Product review"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={
          value.length > 0 && value.length < minLength
            ? `Review must be at least ${minLength} characters`
            : undefined
        }
      />
      <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
        Minimum: {minLength} characters (current: {value.length})
      </p>
    </div>
  )
}
