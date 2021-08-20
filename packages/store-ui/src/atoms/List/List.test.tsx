import { render } from '@testing-library/react'
import React from 'react'

import List from './List'

const optionsArray = [
  ['great', 'Great'],
  ['ok', 'Ok'],
  ['bad', 'Bad'],
]

const mapPairToItem = (value: string, variant: string) => {
  switch (variant) {
    case 'unordered':
      return <ul key={value}>{value}</ul>

    case 'ordered':
      return <ol key={value}>{value}</ol>

    case 'description':
      return <dl key={value}>{value}</dl>

    default:
      return <div key={value}>{value}</div>
  }
}

describe('List', () => {
  it('`data-store-List` is present', () => {
    const { getByTestId } = render(
      <List testId="store-list" variant="default">
        {optionsArray.map(([value, variant]) => {
          return mapPairToItem(value, variant)
        })}
      </List>
    )

    expect(getByTestId('store-list')).toHaveAttribute('data-store-list-default')
  })

  it('List is empty when no options are given', () => {
    const { getByTestId } = render(<List testId="store-list" />)

    expect(getByTestId('store-list')).toBeEmptyDOMElement()
  })

  it('List is ordered', () => {
    const { getByTestId } = render(
      <List variant="ordered" testId="store-list">
        {optionsArray.map(([value, variant]) => {
          return mapPairToItem(value, variant)
        })}
      </List>
    )

    expect(getByTestId('store-list')).toHaveAttribute('data-store-list-ordered')
  })
})
