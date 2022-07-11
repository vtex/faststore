import { useState } from 'react'

import type { InputTextProps } from '.'
import InputText from '.'

const story = {
  component: InputText,
  title: 'Atoms/InputText ⚠️',
  argTypes: {
    inputRef: {
      table: {
        disable: true,
      },
    },
    id: {
      type: { name: 'string', required: true },
    },
    actionable: {
      type: { name: 'boolean' },
    },
  },
}

const Template = ({ ...args }: InputTextProps) => (
  <div style={{ width: 400 }}>
    <InputText {...args} />
  </div>
)

const TemplateActionable = ({ ...args }: InputTextProps) => {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string>()

  return (
    <div style={{ width: 400 }}>
      <InputText
        actionable
        error={error}
        value={input}
        onSubmit={() => setError('Invalid Postal Code')}
        onClear={() => {
          setError(undefined)
          setInput('')
        }}
        onChange={(e) => {
          error && setError(undefined)
          setInput(e.target.value)
        }}
        {...args}
      />
    </div>
  )
}

export const Default = Template.bind({})
export const HasError = Template.bind({})
export const Actionable = TemplateActionable.bind({})
export const Disabled = Template.bind({})

Default.args = {
  id: 'default-input-text',
  label: 'Email',
}

HasError.args = {
  id: 'error-input-text',
  label: 'Email',
  value: 'invalid@mail',
  error: 'Please, add a valid email',
}

Actionable.args = {
  id: 'actionable-input-text',
  label: 'Postal Code',
}

Disabled.args = {
  id: 'disabled-input-text',
  label: 'Email',
  disabled: true,
}

export default story
