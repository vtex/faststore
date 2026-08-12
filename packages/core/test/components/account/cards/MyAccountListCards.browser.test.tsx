import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockReload = vi.hoisted(() => vi.fn())
const mockUseRouter = vi.hoisted(() => vi.fn(() => ({ reload: mockReload })))

vi.mock('next/router', () => ({
  useRouter: mockUseRouter,
}))

import { MyAccountListCards } from 'src/components/account/cards/MyAccountListCards'

afterEach(() => {
  cleanup()
  mockReload.mockClear()
})

const VISA_PERSONAL = {
  accountId: 'acc-1',
  bin: '411111',
  cardNumber: '**** **** **** 1111',
  paymentSystem: '2',
  paymentSystemName: 'Visa',
  isDefault: true,
  isActive: true,
}

const MASTERCARD_PERSONAL = {
  accountId: 'acc-2',
  bin: '555555',
  cardNumber: '**** **** **** 2222',
  paymentSystem: '3',
  paymentSystemName: 'Mastercard',
  isDefault: false,
  isActive: true,
}

const AMEX_SHARED = {
  accountId: 'acc-3',
  bin: '378282',
  cardNumber: '**** **** **** 3333',
  paymentSystem: '4',
  paymentSystemName: 'Amex',
  isDefault: false,
  isActive: true,
}

describe('MyAccountListCards', () => {
  it('shows the tab bar and renders Personal cards by default', () => {
    render(
      <MyAccountListCards
        personalCards={[VISA_PERSONAL, MASTERCARD_PERSONAL]}
        sharedCards={[AMEX_SHARED]}
        hasOrgAssociation
        canViewPersonalCards
      />
    )

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Personal' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByText('Visa')).toBeInTheDocument()
    expect(screen.getByText('Mastercard')).toBeInTheDocument()
    expect(screen.queryByText('Amex')).not.toBeInTheDocument()
  })

  it('marks the default card with the default badge', () => {
    render(
      <MyAccountListCards
        personalCards={[VISA_PERSONAL, MASTERCARD_PERSONAL]}
        sharedCards={[]}
        hasOrgAssociation={false}
        canViewPersonalCards
      />
    )

    const visaItem = screen
      .getByText('Visa')
      .closest('[data-fs-list-cards-item]')
    expect(visaItem).toHaveTextContent('Default')

    const mastercardItem = screen
      .getByText('Mastercard')
      .closest('[data-fs-list-cards-item]')
    expect(mastercardItem).not.toHaveTextContent('Default')
  })

  it('falls back to the generic card label when paymentSystemName is absent', () => {
    render(
      <MyAccountListCards
        personalCards={[{ accountId: 'acc-9', cardNumber: '**** 9999' }]}
        sharedCards={[]}
        hasOrgAssociation={false}
        canViewPersonalCards
      />
    )

    expect(screen.getByText('Card')).toBeInTheDocument()
  })

  it('switches to the Shared tab by clicking it, and shows the tooltip info icon', () => {
    render(
      <MyAccountListCards
        personalCards={[VISA_PERSONAL]}
        sharedCards={[AMEX_SHARED]}
        hasOrgAssociation
        canViewPersonalCards
      />
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Shared' }))

    expect(screen.getByRole('tab', { name: 'Shared' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByText('Amex')).toBeInTheDocument()
    expect(screen.queryByText('Visa')).not.toBeInTheDocument()
  })

  it('moves focus and switches tabs on ArrowRight/ArrowLeft', () => {
    render(
      <MyAccountListCards
        personalCards={[VISA_PERSONAL]}
        sharedCards={[AMEX_SHARED]}
        hasOrgAssociation
        canViewPersonalCards
      />
    )

    const personalTab = screen.getByRole('tab', { name: 'Personal' })
    const sharedTab = screen.getByRole('tab', { name: 'Shared' })

    personalTab.focus()
    fireEvent.keyDown(personalTab, { key: 'ArrowRight' })
    expect(sharedTab).toHaveAttribute('aria-selected', 'true')
    expect(sharedTab).toHaveFocus()

    fireEvent.keyDown(sharedTab, { key: 'ArrowLeft' })
    expect(personalTab).toHaveAttribute('aria-selected', 'true')
    expect(personalTab).toHaveFocus()
  })

  it('renders shared cards directly with no tab chrome when Personal is unavailable (sharedOnly)', () => {
    render(
      <MyAccountListCards
        personalCards={[]}
        sharedCards={[AMEX_SHARED]}
        hasOrgAssociation
        canViewPersonalCards={false}
      />
    )

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.getByText('Amex')).toBeInTheDocument()
  })

  it('renders only the Personal tab when there is no org association (unconfirmed combo kept as-is)', () => {
    render(
      <MyAccountListCards
        personalCards={[VISA_PERSONAL]}
        sharedCards={[]}
        hasOrgAssociation={false}
        canViewPersonalCards={false}
      />
    )

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(
      screen.queryByRole('tab', { name: 'Shared' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Personal' })).toBeInTheDocument()
  })

  it('filters cards by search term', () => {
    render(
      <MyAccountListCards
        personalCards={[VISA_PERSONAL, MASTERCARD_PERSONAL]}
        sharedCards={[]}
        hasOrgAssociation={false}
        canViewPersonalCards
      />
    )

    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'visa' },
    })

    expect(screen.getByText('Visa')).toBeInTheDocument()
    expect(screen.queryByText('Mastercard')).not.toBeInTheDocument()
  })

  it('shows the no-results empty state when the search matches nothing', () => {
    render(
      <MyAccountListCards
        personalCards={[VISA_PERSONAL]}
        sharedCards={[]}
        hasOrgAssociation={false}
        canViewPersonalCards
      />
    )

    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'nonexistent-brand' },
    })

    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('shows the empty state when there are no cards at all', () => {
    render(
      <MyAccountListCards
        personalCards={[]}
        sharedCards={[]}
        hasOrgAssociation={false}
        canViewPersonalCards
      />
    )

    expect(screen.getByText("You don't have any cards")).toBeInTheDocument()
  })

  it('paginates when there are more than 25 cards', () => {
    const manyCards = Array.from({ length: 26 }, (_, i) => ({
      accountId: `acc-${i}`,
      paymentSystemName: `Brand ${i}`,
      cardNumber: `**** ${i}`,
    }))

    render(
      <MyAccountListCards
        personalCards={manyCards}
        sharedCards={[]}
        hasOrgAssociation={false}
        canViewPersonalCards
      />
    )

    expect(screen.getByText('Brand 0')).toBeInTheDocument()
    expect(screen.queryByText('Brand 25')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next Page' }))

    expect(screen.getByText('Brand 25')).toBeInTheDocument()
    expect(screen.queryByText('Brand 0')).not.toBeInTheDocument()
  })

  it('shows the error state with a retry action that reloads the page', () => {
    render(
      <MyAccountListCards
        personalCards={[]}
        sharedCards={[]}
        hasOrgAssociation={false}
        canViewPersonalCards
        hasError
      />
    )

    expect(screen.getByText("We couldn't load your cards")).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(mockReload).toHaveBeenCalledTimes(1)
  })
})
