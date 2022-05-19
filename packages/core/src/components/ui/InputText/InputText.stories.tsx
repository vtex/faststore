import type { InputTextProps } from '.'
import InputText from '.'

const story = {
  component: InputText,
  title: 'Atoms/InputText',
  argTypes: {
    inputRef: {
      table: {
        disable: true,
      },
    },
    id: {
      type: { name: 'string', required: true },
    },
  },
}

const Template = ({ ...args }: InputTextProps) => (
  <div style={{ width: 400 }}>
    <InputText {...args} />
  </div>
)

export const Default = Template.bind({})
export const HasError = Template.bind({})
export const Actionable = Template.bind({})
export const Disabled = Template.bind({})

Default.args = {
  id: 'default-input-text',
  label: 'Email',
  errorMessage: 'Please, add a valid email',
  disabled: false,
}

HasError.args = {
  id: 'error-input-text',
  label: 'Email',
  value: 'invalid@mail',
  errorMessage: 'Please, add a valid email',
  disabled: false,
}

Actionable.args = {
  id: 'actionable-input-text',
  label: 'Postal Code',
  actionable: true,
  errorMessage: 'Invalid Postal Code',
  disabled: false,
}

Disabled.args = {
  id: 'disabled-input-text',
  label: 'Email',
  errorMessage: 'Please, add a valid email',
  disabled: true,
}

export default story
