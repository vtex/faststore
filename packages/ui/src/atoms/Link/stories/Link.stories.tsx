import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { LinkProps } from '../Link'
import LinkComponent from '../Link'
import mdx from './Link.mdx'

const LinkDefaultTemplate: Story<LinkProps<'a'>> = () => (
  <LinkComponent id="as-anchor" href="/">
    A default link
  </LinkComponent>
)

export const Default = LinkDefaultTemplate.bind({})

const LinkAsDivTemplate: Story<LinkProps<'div'>> = () => (
  <LinkComponent id="as-div" as="div">
    <span>A span inside the Link component</span>
    <a href="/">A link inside the Link component</a>
  </LinkComponent>
)

export const AsDiv = LinkAsDivTemplate.bind({})

export default {
  title: 'Atoms/Link',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
