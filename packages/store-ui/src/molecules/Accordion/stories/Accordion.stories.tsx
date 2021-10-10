import type { Story } from '@storybook/react'
import React, { useState } from 'react'

import { AccordionButton, AccordionItem, AccordionPanel } from '..'
import type { AccordionProps } from '..'
import Component from '../Accordion'
import mdx from './Accordion.mdx'
import { Icon } from '../../..'

const Caret = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-chevron-down"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const Clothing = ({ icon }: { icon?: boolean }) => (
  <AccordionItem index={0}>
    <AccordionButton>
      Clothing {icon ? <Icon component={<Caret />} /> : null}
    </AccordionButton>
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

const Sale = ({ icon }: { icon?: boolean }) => (
  <AccordionItem index={1}>
    <AccordionButton>
      Sale {icon ? <Icon component={<Caret />} /> : null}
    </AccordionButton>
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

export const MultipleAndCollapsible = AccordionTemplate.bind({})

const ToggleWithIconTemplate: Story<AccordionProps> = ({ testId }) => {
  const [indices, setIndices] = useState<number[]>([0])
  const onChange = (index: number) => {
    setIndices([index])
  }

  return (
    <Component testId={testId} indices={indices} onChange={onChange}>
      <Clothing icon />
      <Sale icon />
    </Component>
  )
}

export const ToggleWithIcon = ToggleWithIconTemplate.bind({})

export default {
  title: 'Molecules/Accordion',
  component: MultipleAndCollapsible,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
