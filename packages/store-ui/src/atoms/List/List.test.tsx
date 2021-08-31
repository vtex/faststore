import { render } from '@testing-library/react'
import React from 'react'

import List from './List'

const optionsArray = ['Great', 'Ok', 'Bad']

describe('List', () => {
  it('`data-store-list` is present', () => {
    const { getByTestId } = render(
      <List testId="store-list">
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toHaveAttribute('data-store-list-default')
  })

  it('List is empty when no options are given', () => {
    const { getByTestId } = render(<List testId="store-list" />)

    expect(getByTestId('store-list')).toBeEmptyDOMElement()
  })

  it('List has correct data-store attribute', () => {
    const { getByTestId } = render(
      <List variant="ordered" testId="store-list">
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toHaveAttribute('data-store-list-ordered')
  })

  it('List is unordered', () => {
    const { getByTestId } = render(
      <List variant="unordered" testId="store-list">
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toBeInstanceOf(HTMLUListElement)
  })

  it('List is description', () => {
    const { getByTestId } = render(
      <List variant="description" testId="store-list">
        {optionsArray.map((value) => {
          return <li key={value}>{value}</li>
        })}
      </List>
    )

    expect(getByTestId('store-list')).toBeInstanceOf(HTMLDListElement)
  })
})
