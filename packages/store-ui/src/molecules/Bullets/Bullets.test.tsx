import { render, act, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
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

    const bulletItems = queryAllByTestId('store-bullets-item')

    expect(bulletItems).toHaveLength(5)

    bulletItems.forEach((bullet) =>
      expect(bullet).toHaveAttribute('data-bullet-item')
    )
  })

  it('should render only the currently active bullet with a `data-active` attribute', () => {
    const { queryAllByTestId } = render(
      <Bullets totalQuantity={5} activeBullet={2} onClick={() => {}} />
    )

    const bulletItems = queryAllByTestId('store-bullets-item')

    // eslint-disable-next-line prefer-destructuring
    const expectedActiveBullet = bulletItems[2]

    expect(bulletItems).toHaveLength(5)
    expect(expectedActiveBullet).toHaveAttribute('aria-selected', 'true')

    // Remove the currently active bullet, at index 2
    bulletItems.splice(2, 1)
    // Validate that no other element has the 'data-active' attribute
    bulletItems.forEach((bullet) => {
      expect(bullet).toHaveAttribute('aria-selected', 'false')
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

    const bulletItems = queryAllByTestId('store-bullets-item')

    expect(bulletItems).toHaveLength(5)

    // Each bullet is rendered with an <Button /> inside, and the button gets
    // the onClick handler.

    act(() => {
      // 'click' the bullet at index 3 (the 4th visible bullet)
      fireEvent.click(bulletItems[3])
    })

    expect(updateCurrentBulletMock).toHaveBeenCalledTimes(1)
    expect(updateCurrentBulletMock).toHaveBeenCalledWith(expect.any(Object), 3)
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(
        <Bullets totalQuantity={5} activeBullet={2} onClick={() => {}} />
      )

      expect(await axe(getByTestId('store-bullets'))).toHaveNoViolations()
    })

    it('should have no violations with ariaControlsGenerator', async () => {
      const { container } = render(
        <>
          <div id="item-1">content for bullets</div>
          <Bullets
            totalQuantity={1}
            activeBullet={0}
            onClick={() => {}}
            ariaControlsGenerator={(idx: number) => `item-${idx + 1}`}
          />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('check roles and aria-controls attributes', () => {
      const { getAllByRole, getByTestId } = render(
        <>
          <div id="item-1">content for bullets</div>
          <div id="item-2">content for bullets</div>
          <Bullets
            totalQuantity={2}
            activeBullet={0}
            onClick={() => {}}
            ariaControlsGenerator={(idx: number) => `item-${idx + 1}`}
          />
        </>
      )

      // Check roles
      expect(getAllByRole('tablist')).toHaveLength(1)
      expect(getAllByRole('tab')).toHaveLength(2)
      expect(getAllByRole('tab', { selected: true })).toHaveLength(1)

      // Check bullets aria-controls
      expect(
        getByTestId('store-bullets').querySelectorAll('[aria-controls]')
      ).toHaveLength(2)
    })
  })
})
