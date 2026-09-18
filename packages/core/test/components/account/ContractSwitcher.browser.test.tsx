/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseAvailableContracts = vi.hoisted(() => vi.fn())
const mockSwitchContract = vi.hoisted(() => vi.fn())
const mockUseSwitchContract = vi.hoisted(() => vi.fn())
const mockUseAccountNavigationLabels = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/account/useAvailableContracts', () => ({
  useAvailableContracts: mockUseAvailableContracts,
}))

vi.mock('src/sdk/account/useSwitchContract', () => ({
  useSwitchContract: mockUseSwitchContract,
}))

vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountNavigationLabels: mockUseAccountNavigationLabels,
}))

vi.mock('src/sdk/session', () => ({
  useSession: () => ({
    b2b: { customerId: 'a', unitId: 'unit-1' },
  }),
}))

import { ContractSwitcher } from '../../../src/components/account/Drawer/OrganizationDrawer/ContractSwitcher'

const contracts = [
  { id: 'a', corporateName: 'Stellar Global', isActive: true, isDefault: true },
  { id: 'b', corporateName: 'Acme Foods', isActive: false },
  { id: 'c', corporateName: 'Beacon Security Corp', isActive: false },
]

describe('ContractSwitcher', () => {
  beforeEach(() => {
    mockSwitchContract.mockResolvedValue(true)
    mockUseSwitchContract.mockReturnValue({
      switchContract: mockSwitchContract,
      loading: false,
      error: null,
      enabled: true,
    })
    mockUseAvailableContracts.mockReturnValue({
      contracts,
      loading: false,
      error: null,
    })
    mockUseAccountNavigationLabels.mockReturnValue(undefined)
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

    const { container } = render(
      <ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />
    )

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

    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    expect(screen.getByRole('alert')).toBeTruthy()
  })

  it('shows an empty state when there is no alternative contract', () => {
    mockUseAvailableContracts.mockReturnValue({
      contracts: [{ id: 'a', corporateName: 'Stellar Global', isActive: true }],
      loading: false,
      error: null,
    })

    const { container } = render(
      <ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />
    )

    expect(
      container.querySelector('[data-fs-contract-switcher-empty]')
    ).toBeTruthy()
  })

  it('shows the active contract as the current session and lists alternatives (REQ-04, REQ-05)', () => {
    const { container } = render(
      <ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />
    )

    const currentCard = container.querySelector(
      '[data-fs-contract-switcher-current-card]'
    )
    expect(currentCard?.textContent).toContain('Stellar Global')
    expect(
      currentCard?.querySelector('[data-fs-contract-switcher-default]')
    ).toBeTruthy()

    // The active contract is not offered as a selectable alternative.
    expect(screen.getByText('Acme Foods')).toBeTruthy()
    expect(screen.getByText('Beacon Security Corp')).toBeTruthy()
    const options = container.querySelectorAll(
      '[data-fs-contract-switcher-option]'
    )
    expect(options.length).toBe(2)
  })

  it('requires selecting a contract before Confirm is enabled, then switches (REQ-03)', async () => {
    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    const confirm = screen.getByRole('button', { name: /confirm/i })
    expect((confirm as HTMLButtonElement).disabled).toBe(true)

    fireEvent.click(screen.getByText('Acme Foods'))
    expect((confirm as HTMLButtonElement).disabled).toBe(false)

    fireEvent.click(confirm)

    await waitFor(() => expect(mockSwitchContract).toHaveBeenCalledWith('b'))
  })

  it('keeps Confirm disabled until a different contract is selected', () => {
    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    const confirm = screen.getByRole('button', { name: /confirm/i })
    expect((confirm as HTMLButtonElement).disabled).toBe(true)

    fireEvent.click(screen.getByText('Acme Foods'))

    expect((confirm as HTMLButtonElement).disabled).toBe(false)
  })

  it('keeps Confirm disabled when switching is unavailable', () => {
    mockUseSwitchContract.mockReturnValue({
      switchContract: mockSwitchContract,
      loading: false,
      error: null,
      enabled: false,
    })

    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    fireEvent.click(screen.getByText('Acme Foods'))

    const confirm = screen.getByRole('button', { name: /confirm/i })
    expect((confirm as HTMLButtonElement).disabled).toBe(true)
  })

  it('keeps Confirm disabled when the selected contract is filtered out', () => {
    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    fireEvent.click(screen.getByText('Acme Foods'))

    const confirm = screen.getByRole('button', { name: /confirm/i })
    expect((confirm as HTMLButtonElement).disabled).toBe(false)

    fireEvent.change(screen.getByLabelText('Search contracts'), {
      target: { value: 'beacon' },
    })

    expect((confirm as HTMLButtonElement).disabled).toBe(true)
  })

  it('filters the alternatives by search', () => {
    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Search contracts'), {
      target: { value: 'acme' },
    })

    expect(screen.getByText('Acme Foods')).toBeTruthy()
    expect(screen.queryByText('Beacon Security Corp')).toBeNull()
  })

  it('shows an empty search result message when nothing matches', () => {
    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Search contracts'), {
      target: { value: 'zzzz-no-match' },
    })

    expect(screen.getByText('No contracts match your search.')).toBeTruthy()
  })

  it('clears the search input', () => {
    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    const searchInput = screen.getByLabelText(
      'Search contracts'
    ) as HTMLInputElement

    fireEvent.change(searchInput, {
      target: { value: 'acme' },
    })
    fireEvent.click(screen.getByLabelText('Clear search'))

    expect(searchInput.value).toBe('')
    expect(screen.getByText('Beacon Security Corp')).toBeTruthy()
  })

  it('shows a switch error when the contract change fails', () => {
    mockUseSwitchContract.mockReturnValue({
      switchContract: mockSwitchContract,
      loading: false,
      error: new Error('switch failed'),
      enabled: true,
    })

    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    expect(screen.getByText(/couldn't switch your contract/i)).toBeTruthy()
  })

  it('does not reload when the switch returns false', async () => {
    mockSwitchContract.mockResolvedValue(false)

    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    fireEvent.click(screen.getByText('Acme Foods'))
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => expect(mockSwitchContract).toHaveBeenCalledWith('b'))
  })

  it('honors CMS-provided labels for the header, current session, search, footer, and available count', () => {
    mockUseAccountNavigationLabels.mockReturnValue({
      contractSwitcherTitleLabel: 'Trocar contrato',
      contractSwitcherBackLabel: 'Voltar ao menu da conta',
      contractSwitcherCloseLabel: 'Fechar',
      contractSwitcherCurrentSessionLabel: 'Sessão atual',
      contractSwitcherSearchPlaceholder: 'Buscar',
      contractSwitcherSearchAriaLabel: 'Buscar contratos',
      contractSwitcherAvailableCountLabel:
        'Selecione um dos {count} contratos disponíveis:',
      contractSwitcherCancelLabel: 'Cancelar',
      contractSwitcherConfirmLabel: 'Confirmar',
    })

    const { container } = render(
      <ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />
    )

    expect(screen.getByText('Trocar contrato')).toBeTruthy()
    expect(screen.getByLabelText('Voltar ao menu da conta')).toBeTruthy()
    expect(screen.getByLabelText('Fechar')).toBeTruthy()
    expect(screen.getByText('Sessão atual')).toBeTruthy()
    expect(screen.getByPlaceholderText('Buscar')).toBeTruthy()
    expect(screen.getByLabelText('Buscar contratos')).toBeTruthy()
    expect(
      container.querySelector('[data-fs-contract-switcher-count]')?.textContent
    ).toBe('Selecione um dos 2 contratos disponíveis:')
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeTruthy()
  })

  it('honors CMS-provided labels for the empty, no-match, load-error, and switch-error states', () => {
    mockUseAccountNavigationLabels.mockReturnValue({
      contractSwitcherEmptyLabel: 'Nenhum outro contrato disponível.',
      contractSwitcherNoMatchLabel: 'Nenhum contrato encontrado.',
      contractSwitcherLoadErrorLabel: 'Não foi possível carregar contratos.',
      contractSwitcherSwitchErrorLabel: 'Não foi possível trocar de contrato.',
      contractSwitcherClearSearchLabel: 'Limpar busca',
    })

    mockUseAvailableContracts.mockReturnValue({
      contracts: [{ id: 'a', corporateName: 'Stellar Global', isActive: true }],
      loading: false,
      error: null,
    })

    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    expect(screen.getByText('Nenhum outro contrato disponível.')).toBeTruthy()
  })

  it('honors the CMS-provided load error label', () => {
    mockUseAccountNavigationLabels.mockReturnValue({
      contractSwitcherLoadErrorLabel: 'Não foi possível carregar contratos.',
    })
    mockUseAvailableContracts.mockReturnValue({
      contracts: [],
      loading: false,
      error: new Error('boom'),
    })

    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    expect(
      screen.getByText('Não foi possível carregar contratos.')
    ).toBeTruthy()
  })

  it('honors the CMS-provided no-match and clear-search labels', () => {
    mockUseAccountNavigationLabels.mockReturnValue({
      contractSwitcherNoMatchLabel: 'Nenhum contrato encontrado.',
      contractSwitcherClearSearchLabel: 'Limpar busca',
    })

    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Search contracts'), {
      target: { value: 'zzzz-no-match' },
    })
    expect(screen.getByText('Nenhum contrato encontrado.')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Search contracts'), {
      target: { value: 'acme' },
    })
    expect(screen.getByLabelText('Limpar busca')).toBeTruthy()
  })

  it('honors the CMS-provided switch-error label', () => {
    mockUseAccountNavigationLabels.mockReturnValue({
      contractSwitcherSwitchErrorLabel: 'Não foi possível trocar de contrato.',
    })
    mockUseSwitchContract.mockReturnValue({
      switchContract: mockSwitchContract,
      loading: false,
      error: new Error('switch failed'),
      enabled: true,
    })

    render(<ContractSwitcher onBack={vi.fn()} onClose={vi.fn()} />)

    expect(
      screen.getByText('Não foi possível trocar de contrato.')
    ).toBeTruthy()
  })
})
