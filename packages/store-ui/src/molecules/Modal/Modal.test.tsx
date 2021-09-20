import React, { useState } from 'react'
import { fireEvent, render } from '@testing-library/react'

import Modal from './Modal'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'

const modalTestId = 'store-modal'

const TestModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }

  const onDismiss = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button testId="trigger" onClick={handleOpen}>
        OpenModal
      </Button>
      <Modal isOpen={isOpen} testId={modalTestId} onDismiss={onDismiss}>
        <Input testId="first-input" />
        <Button testId="first-button" />
      </Modal>
    </>
  )
}

describe('Modal', () => {
  it('The attribute data-store-modal should be present', () => {
    const { getByTestId } = render(
      <Modal aria-label="test modal" testId="store-modal" isOpen>
        Foo
      </Modal>
    )

    expect(getByTestId('store-modal')).toHaveAttribute('data-store-modal')
  })

  it('Test isOpen', () => {
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

    fireEvent.focus(getByTestId('sentinelStart'))
    expect(getByTestId('first-button')).toHaveFocus()

    // Simulate loop back: from last to first element
    fireEvent.keyDown(document.activeElement!, {
      key: 'Tab',
    })

    fireEvent.focus(getByTestId('sentinelEnd'))
    expect(getByTestId('first-input')).toHaveFocus()
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

  it('Close when press escape', () => {
    const { getByTestId } = render(<TestModal />)

    fireEvent.click(getByTestId('trigger'))

    // Pressing any key other than 'Escape' won't close the modal
    fireEvent.keyPress(getByTestId('store-modal'), { key: 'j' })
    expect(getByTestId('store-modal')).toBeInTheDocument()

    // Press Escape
    fireEvent.keyDown(getByTestId('store-modal'), {
      key: 'Escape',
    })

    expect(document.querySelector(`[data-testid="${modalTestId}"]`)).toBeNull()
  })

  it('Close when click outside the modal', () => {
    const { getByTestId } = render(<TestModal />)

    fireEvent.click(getByTestId('trigger'))

    expect(getByTestId('store-modal')).toBeInTheDocument()

    // Close the modal
    fireEvent.click(getByTestId('store-overlay'))

    expect(document.querySelector(`[data-testid="${modalTestId}"]`)).toBeNull()
  })
})
