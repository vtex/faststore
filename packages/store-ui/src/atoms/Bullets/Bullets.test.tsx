import { render, act, fireEvent } from '@testing-library/react'
import React from 'react'

import Bullets from './Bullets'

describe('Bullets', () => {
  it('should have `data-store-bullets` attribute', () => {
    const { getByTestId } = render(
      <Bullets totalQuantity={5} activeBullet={2} onClick={() => {}} />
    )

    expect(getByTestId('store-bullets')).toHaveAttribute('data-store-bullets')
  })

  it('should render 5 bullets with `data-bullet-item` attribute', () => {
    const { queryAllByTestId } = render(
      <Bullets totalQuantity={5} activeBullet={2} onClick={() => {}} />
    )

    expect(queryAllByTestId('bullet-item')).toHaveLength(5)
  })

  it('should render only the currently active bullet with a `data-active` attribute', () => {
    const { queryAllByTestId } = render(
      <Bullets totalQuantity={5} activeBullet={2} onClick={() => {}} />
    )

    const bulletItems = queryAllByTestId('bullet-item')

    // eslint-disable-next-line prefer-destructuring
    const expectedActiveBullet = bulletItems[2]

    expect(bulletItems).toHaveLength(5)
    expect(expectedActiveBullet).toHaveAttribute('data-active')

    // Remove the currently active bullet, at index 2
    bulletItems.splice(2, 1)
    // Validate that no other element has the 'data-active' attribute
    bulletItems.forEach((bullet) => {
      expect(bullet).not.toHaveAttribute('data-active')
    })
  })

  it('should ensure that onClick is called with the correct bullet index', () => {
    const updateCurrentBulletMock = jest.fn()

    const { queryAllByTestId } = render(
      <Bullets
        totalQuantity={5}
        activeBullet={2}
        onClick={updateCurrentBulletMock}
      />
    )

    const bulletItems = queryAllByTestId('bullet-item')

    expect(bulletItems).toHaveLength(5)

    // Each bullet is rendered with an <Button /> inside, and the button gets
    // the onClick handler.
    const bullets = queryAllByTestId('store-button')

    act(() => {
      // 'click' the bullet at index 3 (the 4th visible bullet)
      fireEvent.click(bullets[3])
    })

    expect(updateCurrentBulletMock).toHaveBeenCalledTimes(1)
    expect(updateCurrentBulletMock).toHaveBeenCalledWith(expect.any(Object), 3)
  })
})
