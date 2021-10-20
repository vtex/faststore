import type { Story } from '@storybook/react'
import React from 'react'

import type { FormProps } from '../Form'
import Component from '../Form'
import mdx from './Form.mdx'

const FormTemplate: Story<FormProps> = ({ testId }) => {
  return <Component testId={testId} />
}

export const Form = FormTemplate.bind({})

export default {
  title: 'Molecules/Form',
  component: Form,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
