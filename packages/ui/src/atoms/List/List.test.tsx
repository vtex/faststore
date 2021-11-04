import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React, { Fragment } from 'react'

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
        {optionsArray.map((value, index) => {
          return (
            <Fragment key={index}>
              <dt key={`${index}--term`}>{value}</dt>
              <dd key={`${index}--details`}>option</dd>
            </Fragment>
          )
        })}
      </List>
    )

    expect(getByTestId('store-list')).toBeInstanceOf(HTMLDListElement)
  })

  describe('Accessibility', () => {
    it('should have no violations when rendering the default variant', async () => {
      const { getByTestId } = render(
        <List>
          {optionsArray.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </List>
      )

      expect(await axe(getByTestId('store-list'))).toHaveNoViolations()
    })

    it('should have no violations when rendering the unordered variant', async () => {
      const { getByTestId } = render(
        <List variant="unordered">
          {optionsArray.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </List>
      )

      expect(await axe(getByTestId('store-list'))).toHaveNoViolations()
    })

    it('should have no violations when rendering the ordered variant', async () => {
      const { getByTestId } = render(
        <List variant="ordered">
          {optionsArray.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </List>
      )

      expect(await axe(getByTestId('store-list'))).toHaveNoViolations()
    })

    it('should have no violations when rendering the description variant', async () => {
      const { getByTestId } = render(
        <List variant="description">
          {optionsArray.map((option, index) => (
            <Fragment key={index}>
              <dt key={`${index}--term`}>{option}</dt>
              <dd key={`${index}--details`}>option</dd>
            </Fragment>
          ))}
        </List>
      )

      expect(await axe(getByTestId('store-list'))).toHaveNoViolations()
    })
  })
})
