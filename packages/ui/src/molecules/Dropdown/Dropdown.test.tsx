import { fireEvent, render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'
import { act } from 'react-dom/test-utils'

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

  it('Should render DropdownMenu in correct position', () => {
    const { getByText, getByTestId } = render(
      <>
        <SimpleDropdown />
        <div style={{ height: 2000, width: 200 }}>Large element</div>
      </>
    )

    const dropdownButton = getByText(/Dropdown Button/g)

    fireEvent.click(dropdownButton)

    const dropdownMenu = getByTestId('store-dropdown-menu')

    expect(dropdownMenu).toBeInTheDocument()

    const buttonRect = dropdownButton?.getBoundingClientRect()

    fireEvent.scroll(window, { target: { scrollY: 300 } })

    const topLevel: number = buttonRect?.top ?? 0
    const topOffset: number = buttonRect?.height ?? 0
    const topPosition =
      topLevel + topOffset + document.documentElement.scrollTop

    const leftLevel = buttonRect?.left ?? 0
    const leftPosition = leftLevel + document.documentElement.scrollLeft

    const topMenuPosition = dropdownMenu.style.top
    const leftMenuPosition = dropdownMenu.style.left

    expect(topMenuPosition).toEqual(`${topPosition}px`)
    expect(leftMenuPosition).toEqual(`${leftPosition}px`)
  })

  it('Should render 3 dropdownItems when DropdownMenu is opened', () => {
    const { getByText, queryAllByTestId } = render(<SimpleDropdown />)

    const dropdownButton = getByText(/Dropdown Button/g)

    fireEvent.click(dropdownButton)

    expect(queryAllByTestId('store-dropdown-item')).toHaveLength(3)
  })

  it('Should close DropdownMenu and emit onDismiss when DropdownButton is clicked twice', () => {
    const onDismissMock = jest.fn()

    const { getByText, queryByTestId } = render(
      <SimpleDropdown onDismiss={onDismissMock} />
    )

    const dropdownButton = getByText(/Dropdown Button/g)

    fireEvent.click(dropdownButton)
    expect(queryByTestId('store-dropdown-menu')).toBeInTheDocument()

    fireEvent.click(dropdownButton)
    expect(queryByTestId('store-dropdown-menu')).not.toBeInTheDocument()
    expect(onDismissMock).toHaveBeenCalledTimes(1)
  })

  it('Should close menu and emit onDismiss event when Overlay is clicked', () => {
    const onDismissMock = jest.fn()
    const { getByText, queryByTestId, getByTestId } = render(
      <SimpleDropdown onDismiss={onDismissMock} />
    )

    const dropdownButton = getByText(/Dropdown Button/g)

    dropdownButton.click()

    const dropdownMenu = queryByTestId('store-dropdown-menu')

    expect(dropdownMenu).toBeInTheDocument()

    const overlay = getByTestId('store-dropdown-menu-overlay')

    act(() => {
      fireEvent.click(overlay)
    })

    expect(queryByTestId('store-dropdown-menu')).not.toBeInTheDocument()
    expect(onDismissMock).toHaveBeenCalledTimes(1)
  })

  it('Should close menu and emit onDismiss event when other element is clicked', () => {
    const onDismissMock = jest.fn()
    const { getByText, queryByTestId } = render(
      <>
        <span>Other Element</span>
        <SimpleDropdown onDismiss={onDismissMock} />
      </>
    )

    const dropdownButton = getByText(/Dropdown Button/g)

    dropdownButton.click()

    const dropdownMenu = queryByTestId('store-dropdown-menu')

    expect(dropdownMenu).toBeInTheDocument()

    const otherElement = getByText(/Other Element/g)

    act(() => {
      otherElement.click()
    })

    expect(dropdownMenu).not.toBeInTheDocument()
    expect(onDismissMock).toHaveBeenCalledTimes(1)
  })

  it('Should close menu, emit onDismiss and emit onClose, event when an item is clicked', () => {
    const onDismissMock = jest.fn()
    const onClickItemMock = jest.fn()

    const { getByText, queryByTestId, getByTestId } = render(
      <Dropdown onDismiss={onDismissMock}>
        <DropdownButton>Dropdown Button</DropdownButton>
        <DropdownMenu>
          <DropdownItem onClick={onClickItemMock}>Dropdown Item 1</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )

    const dropdownButton = getByText(/Dropdown Button/g)

    dropdownButton.click()

    const dropdownMenu = queryByTestId('store-dropdown-menu')

    expect(dropdownMenu).toBeInTheDocument()

    const firstItem = getByTestId('store-dropdown-item')

    act(() => {
      firstItem.click()
    })

    expect(dropdownMenu).not.toBeInTheDocument()
    expect(onDismissMock).toHaveBeenCalledTimes(1)
    expect(onClickItemMock).toHaveBeenCalledTimes(1)
  })
})

describe('Accessibility', () => {
  const getDropdownStructures = () => {
    const onDismissMock = jest.fn()
    const { getByText, queryAllByTestId, getByTestId, queryByTestId } = render(
      <SimpleDropdown onDismiss={onDismissMock} />
    )

    const dropdownButton = getByText(/Dropdown Button/g)

    fireEvent.click(dropdownButton)

    const dropdownItems = queryAllByTestId('store-dropdown-item')
    const overlay = getByTestId('store-dropdown-menu-overlay')
    const menu = queryByTestId('store-dropdown-menu')

    return { dropdownItems, overlay, menu, onDismissMock }
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
    const { overlay, menu, onDismissMock } = getDropdownStructures()

    fireEvent.keyDown(overlay, {
      key: 'Escape',
    })

    expect(menu).not.toBeInTheDocument()
    expect(onDismissMock).toHaveBeenCalledTimes(1)
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
