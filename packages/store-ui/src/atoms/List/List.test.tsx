import { render } from '@testing-library/react'
import React from 'react'

import List from '.'

const optionsArray = [
  ['great', 'Great'],
  ['ok', 'Ok'],
  ['bad', 'Bad'],
]

const mapPairToItem = (value: string, variant: string) => {
  switch (variant) {
    case 'unordered':
      return <ul>{value}</ul>

    case 'ordered':
      return <ol>{value}</ol>

    case 'description':
      return <dl>{value}</dl>

    default:
      return <div>{value}</div>
  }
}

describe('List', () => {
  it('`data-store-List` is present', () => {
    const { getByTestId } = render(
      <List testId="store-List" variant="default">
        {optionsArray.map(([value, variant]) => {
          return mapPairToItem(value, variant)
        })}
      </List>
    )

    expect(getByTestId('store-List')).toHaveAttribute('data-store-List')
  })

  it('List is empty when no options are given', () => {
    const { getByTestId } = render(<List testId="store-List" />)

    expect(getByTestId('store-List')).toBeEmptyDOMElement()
  })
})
