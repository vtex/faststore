import type { ReactNode } from 'react'
import React, { useState } from 'react'
import { fireEvent, render } from '@testing-library/react'
import { axe } from 'jest-axe'

import Modal from './Modal'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'

const modalTestId = 'store-modal'

const TestModal = ({
  children,
  onDismiss: mockOnDismiss,
}: {
  children?: ReactNode
  onDismiss?: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }

  const onDismiss = () => {
    setIsOpen(false)
    mockOnDismiss?.()
  }

  return (
    <>
      <Button testId="trigger" onClick={handleOpen}>
        OpenModal
      </Button>
      <Modal isOpen={isOpen} testId={modalTestId} onDismiss={onDismiss}>
        <Input testId="first-input" />
        <Button testId="first-button" />
        {children}
      </Modal>
    </>
  )
}

describe('Modal', () => {
  it('The attribute data-store-modal-content should be present', () => {
    const { getByTestId } = render(
      <Modal aria-label="test modal" testId="store-modal" isOpen>
        Foo
      </Modal>
    )

    expect(getByTestId('store-modal')).toHaveAttribute(
      'data-store-modal-content'
    )
  })

  it('Modal should only be rendered if isOpen is true', () => {
    // Check that modal won't be rendered
    const { getByTestId } = render(<TestModal />)

    expect(document.querySelector(`[data-testid="${modalTestId}"]`)).toBeNull()

    fireEvent.click(getByTestId('trigger'))

    expect(getByTestId('store-modal')).toBeInTheDocument()
  })
})

describe('Modal WAI-ARIA Specifications', () => {
  // WAI-ARIA tests
  // https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
  it('AXE Test', async () => {
    render(
      <Modal aria-label="test modal" testId="store-modal" isOpen>
        Foo
      </Modal>
    )

    expect(await axe(document.body)).toHaveNoViolations()
    // This is disabled because the useTrapFocus use sentinel div elements
    // with tabindex and aria-hidden true. This is intentionally, because
    // these divs shouldn't be considered to accessibility API.
    expect(
      await axe(document.body, {
        rules: { 'aria-hidden-focus': { enabled: false } },
      })
    ).toHaveNoIncompletes()
  })

  it('Focus first element', () => {
    const { getByTestId } = render(<TestModal />)

    // Open the modal
    fireEvent.click(getByTestId('trigger'))

    // Check if the first tabbable is focused
    expect(getByTestId('first-input')).toHaveFocus()
  })

  it('Loop focus', () => {
    const { getByTestId } = render(<TestModal />)

    // Open the modal
    fireEvent.click(getByTestId('trigger'))

    expect(getByTestId('first-input')).toHaveFocus()

    // Simulate loop back: from first to last element
    fireEvent.keyDown(document.activeElement!, {
      key: 'Tab',
      shiftKey: true,
    })

    fireEvent.focus(getByTestId('beforeElement'))
    expect(getByTestId('first-button')).toHaveFocus()

    // Simulate loop back: from last to first element
    fireEvent.keyDown(document.activeElement!, {
      key: 'Tab',
    })

    fireEvent.focus(getByTestId('afterElement'))
    expect(getByTestId('first-input')).toHaveFocus()
  })

  it('Loop focus inside the child modal', () => {
    const { getByTestId, getAllByTestId } = render(
      <TestModal>
        <TestModal />
      </TestModal>
    )

    // Open the first modal
    fireEvent.click(getByTestId('trigger'))

    const [, secondTrigger] = getAllByTestId('trigger')

    // Open the internal modal
    fireEvent.click(secondTrigger)

    // Check if the first input of the internal modal is focused
    expect(secondTrigger).not.toHaveFocus()
    expect(getAllByTestId('first-input')[1]).toHaveFocus()

    // Simulate loop back: from first to last element of the internal modal
    fireEvent.keyDown(document.activeElement!, {
      key: 'Tab',
      shiftKey: true,
    })

    fireEvent.focus(getAllByTestId('beforeElement')[1])
    const [firstButton, secondButton] = getAllByTestId('first-button')

    expect(secondButton).toHaveFocus()
    expect(firstButton).not.toHaveFocus()
  })

  it('Focus last element before the modal was opened', () => {
    const { getByTestId } = render(<TestModal />)
    const triggerModalButton = getByTestId('trigger')

    // Focus the trigger button that's outside the modal
    triggerModalButton.focus()
    expect(triggerModalButton).toHaveFocus()

    fireEvent.click(triggerModalButton)

    // Modal focused something inside, so make sure that's not focused
    expect(triggerModalButton).not.toHaveFocus()

    // Close the modal
    fireEvent.click(getByTestId('store-overlay'))

    // Make sure that modal focused back the trigger button after close.
    expect(triggerModalButton).toHaveFocus()
  })

  it('Call onDismiss when press escape without tabbable children', () => {
    const mockDismiss = jest.fn()
    const { getByTestId } = render(
      <Modal isOpen testId="store-modal" onDismiss={mockDismiss}>
        Not focable content
      </Modal>
    )

    fireEvent.keyDown(getByTestId('store-modal'), { key: 'Escape' })
    expect(mockDismiss).toHaveBeenCalled()
  })

  it('Call onDismiss when press escape with tabbable children', () => {
    const mockDismiss = jest.fn()
    const { getByTestId } = render(<TestModal onDismiss={mockDismiss} />)

    fireEvent.click(getByTestId('trigger'))

    // Pressing any key other than 'Escape' won't close the modal
    fireEvent.keyPress(getByTestId('store-modal'), { key: 'j' })
    expect(mockDismiss).not.toHaveBeenCalled()

    // Press Escape
    fireEvent.keyDown(getByTestId('store-modal'), {
      key: 'Escape',
    })

    expect(mockDismiss).toHaveBeenCalled()
  })

  it('Call only the onDismiss from internal modal when press escape', () => {
    const mockExternalDismiss = jest.fn()
    const mockInternalDismiss = jest.fn()
    const { getByTestId, getAllByTestId } = render(
      <TestModal onDismiss={mockExternalDismiss}>
        <TestModal onDismiss={mockInternalDismiss} />
      </TestModal>
    )

    fireEvent.click(getByTestId('trigger'))
    fireEvent.click(getAllByTestId('trigger')[1])

    expect(getAllByTestId('store-modal')[1]).toBeInTheDocument()

    // Press Escape on internal modal. Only the internal modal should close
    fireEvent.keyDown(getAllByTestId('store-modal')[1], {
      key: 'Escape',
    })

    expect(mockExternalDismiss).not.toHaveBeenCalled()
    expect(mockInternalDismiss).toHaveBeenCalled()
  })

  it('Call onDismiss when click outside the modal', () => {
    const mockDismiss = jest.fn()
    const { getByTestId } = render(<TestModal onDismiss={mockDismiss} />)

    fireEvent.click(getByTestId('trigger'))

    // Close the modal
    fireEvent.click(getByTestId('store-overlay'))

    expect(mockDismiss).toHaveBeenCalled()
  })
})
