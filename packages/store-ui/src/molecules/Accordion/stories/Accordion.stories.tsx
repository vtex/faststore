import type { Story } from '@storybook/react'
import React, { useState } from 'react'

import { AccordionButton, AccordionItem, AccordionPanel } from '..'
import type { AccordionProps } from '..'
import Component from '../Accordion'
import mdx from './Accordion.mdx'

const Clothing = () => (
  <AccordionItem index={0}>
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

const Sale = () => (
  <AccordionItem index={1}>
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

const AccordionTemplate: Story<AccordionProps> = ({ testId }) => {
  const [indices, setIndices] = useState<number[]>([])
  const onChange = (index: number) => {
    console.log(index)
    if (indices.includes(index)) {
      setIndices(indices.filter((currentIndex) => currentIndex !== index))
    } else {
      setIndices([...indices, index])
    }
  }

  return (
    <Component testId={testId} indices={indices} onChange={onChange}>
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

export default {
  title: 'Molecules/Accordion',
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
