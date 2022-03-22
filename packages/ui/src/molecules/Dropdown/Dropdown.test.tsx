import { fireEvent, render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Dropdown, { DropdownButton, DropdownItem, DropdownMenu } from '.'

type SimpleDropdownProps = {
  onDismiss?(): void
}

const SimpleDropdown = ({ onDismiss }: SimpleDropdownProps) => (
  <Dropdown onDismiss={onDismiss}>
    <DropdownButton>Dropdown Button</DropdownButton>
    <DropdownMenu>
      <DropdownItem>Dropdown Item 1</DropdownItem>
      <DropdownItem>Dropdown Item 2</DropdownItem>
      <DropdownItem>Dropdown Item 3</DropdownItem>
    </DropdownMenu>
  </Dropdown>
)

describe('Dropdown', () => {
  it('Should render the DropdownButton component', () => {
    const { getByText, queryByTestId } = render(<SimpleDropdown />)

    expect(getByText(/Dropdown Button/g)).toBeInTheDocument()
    expect(queryByTestId('store-dropdown-menu')).not.toBeInTheDocument()
  })

  it('Should render DropdownMenu when DropdownButton is clicked', () => {
    const { getByText, queryByTestId } = render(<SimpleDropdown />)

    const dropdownButton = getByText(/Dropdown Button/g)

    fireEvent.click(dropdownButton)
    expect(queryByTestId('store-dropdown-menu')).toBeInTheDocument()
  })

  it('Should render 3 dropdownItems when DropdownMenu is opened', () => {
    const { getByText, queryAllByTestId } = render(<SimpleDropdown />)

    const dropdownButton = getByText(/Dropdown Button/g)

    fireEvent.click(dropdownButton)

    expect(queryAllByTestId('store-dropdown-item')).toHaveLength(3)
  })

  it('Should close menu and emit onDismiss event when Overlay is clicked', () => {
    const onDismissMock = jest.fn()
    const { getByText, queryByTestId, getByTestId } = render(
      <SimpleDropdown onDismiss={onDismissMock} />
    )

    const dropdownButton = getByText(/Dropdown Button/g)

    fireEvent.click(dropdownButton)

    const dropdownMenu = queryByTestId('store-dropdown-menu')

    expect(dropdownMenu).toBeInTheDocument()

    const overlay = getByTestId('store-overlay')

    fireEvent.click(overlay)

    expect(dropdownMenu).not.toBeInTheDocument()
    expect(onDismissMock).toHaveBeenCalled()
  })
})

describe('Accessibility', () => {
  const getDropdownStructures = () => {
    const { getByText, queryAllByTestId, getByTestId, queryByTestId } = render(
      <SimpleDropdown />
    )

    const dropdownButton = getByText(/Dropdown Button/g)

    fireEvent.click(dropdownButton)

    const dropdownItems = queryAllByTestId('store-dropdown-item')
    const overlay = getByTestId('store-overlay')
    const menu = queryByTestId('store-dropdown-menu')

    return { dropdownItems, overlay, menu }
  }

  it('Should not have violations', async () => {
    const { getByText, getByTestId, container } = render(<SimpleDropdown />)

    const dropdownButton = getByText(/Dropdown Button/g)

    fireEvent.click(dropdownButton)

    const menu = getByTestId('store-dropdown-menu')

    expect(await axe(container)).toHaveNoViolations()
    expect(await axe(container)).toHaveNoIncompletes()
    expect(await axe(menu)).toHaveNoViolations()
    expect(await axe(menu)).toHaveNoIncompletes()
  })

  it('Should close Dropdown menu when Escape key is pressed', async () => {
    const { overlay, menu } = getDropdownStructures()

    fireEvent.keyDown(overlay, {
      key: 'Escape',
    })

    expect(menu).not.toBeInTheDocument()
  })

  it('Should focus on second DropdownItem when ArrowDown key is pressed', async () => {
    const { overlay, dropdownItems } = getDropdownStructures()

    fireEvent.keyDown(overlay, {
      key: 'ArrowDown',
    })

    expect(dropdownItems[1]).toHaveFocus()
  })

  it('Should focus on second DropdownItem when ArrowUp key is pressed twice', () => {
    const { overlay, dropdownItems } = getDropdownStructures()

    fireEvent.keyDown(overlay, {
      key: 'ArrowUp',
    })
    fireEvent.keyDown(overlay, {
      key: 'ArrowUp',
    })

    expect(dropdownItems[1]).toHaveFocus()
  })

  it('Should focus on last DropdownItem when End key is pressed', () => {
    const { overlay, dropdownItems } = getDropdownStructures()

    fireEvent.keyDown(overlay, {
      key: 'End',
    })

    expect(dropdownItems[2]).toHaveFocus()
  })

  it('Should focus on first DropdownItem when Home key is pressed', () => {
    const { overlay, dropdownItems } = getDropdownStructures()

    fireEvent.keyDown(overlay, {
      key: 'ArrowUp',
    })
    fireEvent.keyDown(overlay, {
      key: 'Home',
    })

    expect(dropdownItems[0]).toHaveFocus()
  })
})
