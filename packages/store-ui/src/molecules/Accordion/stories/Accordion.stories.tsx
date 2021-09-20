import type { Story } from '@storybook/react'
import React from 'react'
import { AccordionButton, AccordionItem, AccordionPanel } from '..'

import type { AccordionProps } from '../Accordion'
import Component from '../Accordion'
import mdx from './Accordion.mdx'

const Clothing = () => (
  <AccordionItem>
    <AccordionButton>Clothing</AccordionButton>
    <AccordionPanel>
      <ul>
        <li>
          <a href="/">Shorts</a>
        </li>
        <li>
          <a href="/">Sweatshirt</a>
        </li>
        <li>
          <a href="/">Tank tops</a>
        </li>
      </ul>
    </AccordionPanel>
  </AccordionItem>
)
const Sale = ({ disabled }: {disabled?: boolean}) => (
  <AccordionItem disabled={disabled}>
    <AccordionButton>Sale</AccordionButton>
    <AccordionPanel>
      <ul>
        <li>
          <a href="/">Smartphones</a>
        </li>
        <li>
          <a href="/">TVs</a>
        </li>
      </ul>
    </AccordionPanel>
  </AccordionItem>
)
const AccordionTemplate: Story<AccordionProps> = ({ testId, ...props }) => {
  return (
    <Component testId={testId} {...props}>
      <Clothing />
      <Sale />
    </Component>
  )
}

export const Default = AccordionTemplate.bind({})

export const Collapsible = AccordionTemplate.bind({})
Collapsible.args = {
  collapsible: true,
}

export const Multiple = AccordionTemplate.bind({})
Multiple.args = {
  multiple: true,
}

const AccordionDisabledTemplate: Story<AccordionProps> = ({ testId }) => {
  return (
    <Component testId={testId}>
      <Clothing />
      <Sale disabled />
    </Component>
  )
}

export const Disabled = AccordionDisabledTemplate.bind({})

export default {
  title: 'Molecules/Accordion',
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
