import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { BreadcrumbProps } from '../Breadcrumb'
import Component from '../Breadcrumb'
import mdx from './Breadcrumb.mdx'

const BreadcrumbTemplate: Story<BreadcrumbProps> = ({
  LinkComponent,
  breadcrumb,
  testId,
}) => {
  return (
    <Component
      breadcrumb={breadcrumb}
      LinkComponent={LinkComponent}
      testId={testId}
    />
  )
}

export const Breadcrumb = BreadcrumbTemplate.bind({})

const argTypes: ComponentArgTypes<BreadcrumbProps> = {
  breadcrumb: {
    control: { type: 'object' },
    defaultValue: [
      { href: '', text: 'Level 1' },
      { href: '', text: 'Level 2' },
      { href: '', text: 'Level 3' },
    ],
  },
}

export default {
  title: 'Molecules/Breadcrumb',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
