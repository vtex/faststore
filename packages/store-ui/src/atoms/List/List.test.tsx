import { render } from '@testing-library/react'
import React from 'react'

import List from './List'

const optionsArray = ['Great', 'Ok', 'Bad']

describe('List', () => {
  it('should have `data-store-list` attribute', () => {
    const { getByTestId } = render(
      <List>
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toHaveAttribute('data-store-list')
  })

  it('should be empty if no children are provided', () => {
    const { getByTestId } = render(<List />)

    expect(getByTestId('store-list')).toBeEmptyDOMElement()
  })

  it('should have expected data attributes for each variation', () => {
    const { getByTestId, rerender } = render(
      <List variant="ordered">
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toHaveAttribute('data-ordered')

    rerender(
      <List variant="unordered">
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toHaveAttribute('data-unordered')
  })

  it('should render the expected HTML tag for each variant', () => {
    const { getByTestId, rerender } = render(
      <List variant="unordered">
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toBeInstanceOf(HTMLUListElement)

    rerender(
      <List variant="ordered">
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toBeInstanceOf(HTMLOListElement)

    rerender(
      <List variant="description">
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toBeInstanceOf(HTMLDListElement)
  })
})
