/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseAvailableContracts = vi.hoisted(() => vi.fn())
const mockSwitchContract = vi.hoisted(() => vi.fn())
const mockUseSwitchContract = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/account/useAvailableContracts', () => ({
  useAvailableContracts: mockUseAvailableContracts,
}))

vi.mock('src/sdk/account/useSwitchContract', () => ({
  useSwitchContract: mockUseSwitchContract,
}))

import { ContractSwitcher } from '../../../src/components/account/MyAccountDrawer/OrganizationDrawer/ContractSwitcher'

const contracts = [
  { id: 'a', corporateName: 'Stellar Global', isActive: true },
  { id: 'b', corporateName: 'Acme Foods', isActive: false },
]

describe('ContractSwitcher', () => {
  beforeEach(() => {
    mockSwitchContract.mockResolvedValue(true)
    mockUseSwitchContract.mockReturnValue({
      switchContract: mockSwitchContract,
      loading: false,
      error: null,
    })
    mockUseAvailableContracts.mockReturnValue({
      contracts,
      loading: false,
      error: null,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading state while contracts load', () => {
    mockUseAvailableContracts.mockReturnValue({
      contracts: [],
      loading: true,
      error: null,
    })

    const { container } = render(<ContractSwitcher onBack={vi.fn()} />)

    expect(
      container.querySelector('[data-fs-contract-switcher-loading]')
    ).toBeTruthy()
  })

  it('shows an error state when the list fails to load', () => {
    mockUseAvailableContracts.mockReturnValue({
      contracts: [],
      loading: false,
      error: new Error('boom'),
    })

    render(<ContractSwitcher onBack={vi.fn()} />)

    expect(screen.getByRole('alert')).toBeTruthy()
  })

  it('shows an empty state when there is no alternative contract', () => {
    mockUseAvailableContracts.mockReturnValue({
      contracts: [{ id: 'a', corporateName: 'Stellar Global', isActive: true }],
      loading: false,
      error: null,
    })

    const { container } = render(<ContractSwitcher onBack={vi.fn()} />)

    expect(
      container.querySelector('[data-fs-contract-switcher-empty]')
    ).toBeTruthy()
  })

  it('renders contracts by corporate name and marks the active one (REQ-04, REQ-05)', () => {
    const { container } = render(<ContractSwitcher onBack={vi.fn()} />)

    expect(screen.getByText('Stellar Global')).toBeTruthy()
    expect(screen.getByText('Acme Foods')).toBeTruthy()

    const activeOption = container.querySelector(
      '[data-fs-contract-switcher-option][aria-current="true"]'
    )
    expect(activeOption).toBeTruthy()
    expect((activeOption as HTMLButtonElement).disabled).toBe(true)
  })

  it('switches to a selected contract (REQ-03)', async () => {
    const onSwitched = vi.fn()
    render(<ContractSwitcher onBack={vi.fn()} onSwitched={onSwitched} />)

    fireEvent.click(screen.getByText('Acme Foods'))

    await waitFor(() => expect(mockSwitchContract).toHaveBeenCalledWith('b'))
    await waitFor(() => expect(onSwitched).toHaveBeenCalledTimes(1))
  })
})
