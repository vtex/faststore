import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { LinkProps } from '../Link'
import Component from '../Link'
import mdx from './Link.mdx'

const LinkAsDivTemplate: Story<LinkProps> = ({ as }) => (
  <Component id="link-as-div" as={as}>
    <span>I am a span</span>
    <a href="/">Click here</a>
  </Component>
)

export const LinkAsDiv = LinkAsDivTemplate.bind({})
LinkAsDiv.args = {
  as: 'div',
}

const LinkAsAnchorTemplate: Story<LinkProps> = ({ href }) => (
  <Component id="link-as-anchor" href={href}>
    Click here
  </Component>
)

export const LinkAsAnchor = LinkAsAnchorTemplate.bind({})
LinkAsAnchor.args = {
  href: '/',
}

export default {
  title: 'Atoms/Link',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
