import { render, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import React, { useState } from 'react'

import { AccordionButton, AccordionItem, AccordionPanel } from '.'
import Accordion from './Accordion'

const TestAccordion = () => {
  const [indices, setIndices] = useState<number[]>([])
  const onChange = (index: number) => {
    if (indices.includes(index)) {
      setIndices(indices.filter((currentIndex) => currentIndex !== index))
    } else {
      setIndices([...indices, index])
    }
  }

  return (
    <Accordion
      aria-label="test accordion"
      indices={indices}
      onChange={onChange}
    >
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
    </Accordion>
  )
}

describe('Accordion', () => {
  it('should have `data-store-accordion` attribute', () => {
    const { getByTestId } = render(<TestAccordion />)

    expect(getByTestId('store-accordion')).toHaveAttribute(
      'data-store-accordion'
    )
  })

  it('should not have ARIA violations', async () => {
    const { queryAllByTestId } = render(<TestAccordion />)

    expect(await axe(document.body)).toHaveNoViolations()

    // Open a panel and check again
    const buttons = queryAllByTestId('store-accordion-button')

    fireEvent.click(buttons[1])
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
