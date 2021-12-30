import { render, fireEvent, cleanup } from '@testing-library/react'
import { axe } from 'jest-axe'
import React, { useState } from 'react'

import Accordion from './Accordion'
import AccordionItem from './AccordionItem'
import AccordionButton from './AccordionButton'
import AccordionPanel from './AccordionPanel'

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

      <AccordionItem>
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
  let accordion: HTMLElement
  let items: HTMLElement[]
  let buttons: HTMLElement[]
  let panels: HTMLElement[]

  beforeEach(() => {
    const { getByTestId, getAllByTestId } = render(<TestAccordion />)

    accordion = getByTestId('store-accordion')
    items = getAllByTestId('store-accordion-item')
    buttons = getAllByTestId('store-accordion-button')
    panels = getAllByTestId('store-accordion-panel')
  })

  afterEach(cleanup)

  it('should show panel specified by `indices`', () => {
    const { getAllByTestId } = render(
      <Accordion indices={[1]} onChange={() => {}}>
        <AccordionItem>
          <AccordionButton />
          <AccordionPanel testId="store-accordion-panel-mock" />
        </AccordionItem>
        <AccordionItem>
          <AccordionButton />
          <AccordionPanel testId="store-accordion-panel-mock" />
        </AccordionItem>
      </Accordion>
    )

    const panelsMock = getAllByTestId('store-accordion-panel-mock')

    expect(panelsMock[0]).not.toBeVisible()
    expect(panelsMock[1]).toBeVisible()
  })

  describe('Data attributes', () => {
    it('`Accordion` component should have `data-store-accordion` attribute', () => {
      expect(accordion).toHaveAttribute('data-store-accordion')
    })

    it('`AccordionItem` component should have `data-accordion-item` attribute', () => {
      for (const item of items) {
        expect(item).toHaveAttribute('data-accordion-item')
      }
    })

    it('`AccordionButton` component should have `data-accordion-button` attribute', () => {
      for (const button of buttons) {
        expect(button).toHaveAttribute('data-accordion-button')
      }
    })

    it('`AccordionPanel` component should have `data-accordion-panel` attribute', () => {
      for (const panel of panels) {
        expect(panel).toHaveAttribute('data-accordion-panel')
      }
    })
  })

  describe('User actions', () => {
    it('clicking item should call `onChange` function', () => {
      const mockOnChange = jest.fn()
      const { getByTestId } = render(
        <Accordion onChange={mockOnChange} indices={[]}>
          <AccordionItem>
            <AccordionButton testId="store-accordion-button-mock" />
          </AccordionItem>
        </Accordion>
      )

      const button = getByTestId('store-accordion-button-mock')

      fireEvent.click(button)
      expect(mockOnChange).toHaveBeenCalledTimes(1)
    })

    it('should move focus to the next focusable button on `ArrowDown` press', () => {
      buttons[1].focus()
      expect(buttons[1]).toHaveFocus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(buttons[0]).toHaveFocus()
    })

    it('should move focus to the previous focusable button on `ArrowUp` press', () => {
      buttons[1].focus()
      expect(buttons[1]).toHaveFocus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(buttons[0]).toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    // WAI-ARIA tests
    // https://www.w3.org/TR/wai-aria-practices-1.2/#accordion
    it('should not have violations', async () => {
      expect(await axe(document.body)).toHaveNoViolations()

      // Open a panel and check again
      fireEvent.click(buttons[0])
      expect(await axe(document.body)).toHaveNoViolations()
    })

    it('`role` should be set to `region` for panel elements', () => {
      for (const panel of panels) {
        expect(panel).toHaveAttribute('role', 'region')
      }
    })

    it('`aria-labelledby` for panel elements should point to the corresponding button', () => {
      panels.forEach((panel, index) => {
        expect(panel).toHaveAttribute(
          'aria-labelledby',
          buttons[index].getAttribute('id')
        )
      })
    })

    it('`aria-controls` for button elements should point to the corresponding panel', () => {
      buttons.forEach((button, index) => {
        expect(button).toHaveAttribute(
          'aria-controls',
          panels[index].getAttribute('id')
        )
      })
    })

    it('`aria-expanded` should be true only for active button', () => {
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
      fireEvent.click(buttons[0])
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
    })
  })
})
