import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { BreadcrumbProps } from '../Breadcrumb'
import Component from '../Breadcrumb'
import mdx from './Breadcrumb.mdx'

const DefaultDividerIcon = (props: any) => (
  <svg width="24" height="24" viewBox="0 0 180 180" {...props}>
    <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
  </svg>
)

const BreadcrumbTemplate: Story<BreadcrumbProps> = ({ divider, testId }) => {
  return (
    <Component divider={divider} testId={testId}>
      <a href="/?path=/story/molecules-breadcrumb--breadcrumb-with-icon">
        Home
      </a>
      <a href="/?path=/story/molecules-breadcrumb--breadcrumb-with-icon">
        Level 1
      </a>
      <a href="/?path=/story/molecules-breadcrumb--breadcrumb-with-icon">
        Level 2
      </a>
      <a href="/?path=/story/molecules-breadcrumb--breadcrumb-with-icon">
        Level 3
      </a>
    </Component>
  )
}

export const Breadcrumb = BreadcrumbTemplate.bind({})
Breadcrumb.args = { divider: '/' }
export const BreadcrumbWithIcon = BreadcrumbTemplate.bind({})
BreadcrumbWithIcon.args = {
  divider: <DefaultDividerIcon />,
}

const argTypes: ComponentArgTypes<BreadcrumbProps> = {
  divider: {
    control: { type: 'text' },
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
