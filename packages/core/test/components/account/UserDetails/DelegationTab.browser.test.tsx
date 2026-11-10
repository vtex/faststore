/**
 * @vitest-environment jsdom
 */

import { UIProvider } from '@faststore/ui'
import '@testing-library/jest-dom/vitest'
import {
  cleanup,
  render as baseRender,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseDelegations = vi.hoisted(() => vi.fn())
const mockUseDelegateCandidates = vi.hoisted(() => vi.fn())
const mockUseDelegateRoleComparison = vi.hoisted(() => vi.fn())
const mockCreateDelegation = vi.hoisted(() => vi.fn())
const mockUpdateDelegation = vi.hoisted(() => vi.fn())
const mockRevokeDelegation = vi.hoisted(() => vi.fn())
const mockPushToast = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/account/useDelegations', () => ({
  useDelegations: mockUseDelegations,
  useDelegateCandidates: mockUseDelegateCandidates,
  useDelegateRoleComparison: mockUseDelegateRoleComparison,
  createDelegation: mockCreateDelegation,
  updateDelegation: mockUpdateDelegation,
  revokeDelegation: mockRevokeDelegation,
}))

vi.mock('src/sdk/session', () => ({
  useSession: () => ({ locale: 'en-US', b2b: { unitId: 'unit-1' } }),
}))

vi.mock('@faststore/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@faststore/ui')>()),
  useUI: () => ({ pushToast: mockPushToast }),
}))

import DelegationTab from '../../../../src/components/account/UserDetails/delegation/DelegationTab'

const render = (ui: ReactElement) => baseRender(<UIProvider>{ui}</UIProvider>)

const refresh = vi.fn()

const delegations = [
  {
    id: 'del-1',
    granteeUserId: 'user-1',
    granteeUsername: 'aturner',
    granteeEmail: 'a@acme.com',
    startDate: '2026-11-01',
    endDate: '2026-12-01',
  },
  {
    id: 'del-2',
    granteeUserId: 'user-2',
    granteeUsername: 'awilson',
    granteeEmail: null,
    startDate: '2026-11-05',
    endDate: null,
  },
]

const actingFor = [
  {
    id: 'gr-1',
    granterUserId: 'user-9',
    granterUsername: 'pburgos',
    granterEmail: 'p@acme.com',
    startDate: '2026-07-08',
    endDate: '2026-08-08',
  },
  {
    id: 'gr-2',
    granterUserId: 'user-8',
    granterUsername: null,
    granterEmail: 'qparker@acme.com',
    startDate: '2026-06-15',
    endDate: null,
  },
]

const candidates = [
  { userId: 'user-1', username: 'aturner', email: 'a@acme.com' },
  { userId: 'user-3', username: 'cparker', email: 'c@acme.com' },
  { userId: 'user-4', username: null, email: 'dsmith@acme.com' },
]

const setDelegations = (overrides: Record<string, unknown> = {}) =>
  mockUseDelegations.mockReturnValue({
    delegations,
    actingFor,
    loading: false,
    refreshing: false,
    error: null,
    refresh,
    ...overrides,
  })

const renderTab = () => render(<DelegationTab userName="Donald Green" />)

const getDrawer = () => screen.getByRole('dialog')

const openRowMenu = (rowIndex: number) => {
  fireEvent.click(
    screen.getAllByRole('button', { name: 'More options' })[rowIndex]
  )
}

const chooseCandidate = (name: string) => {
  const input = screen.getByRole('combobox')

  fireEvent.focus(input)
  fireEvent.mouseDown(
    within(screen.getByRole('listbox')).getByText(name, { exact: false })
  )
}

describe('DelegationTab', () => {
  beforeEach(() => {
    // Only the clock: timers keep running so async UI updates still resolve.
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 10, 12))

    setDelegations()
    mockUseDelegateCandidates.mockReturnValue({
      candidates,
      loading: false,
      error: null,
    })
    mockUseDelegateRoleComparison.mockReturnValue({ hasFewerRoles: false })
    mockCreateDelegation.mockResolvedValue({ data: { createDelegation: true } })
    mockUpdateDelegation.mockResolvedValue({ data: { updateDelegation: true } })
    mockRevokeDelegation.mockResolvedValue({ data: { revokeDelegation: true } })
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('titles the list with the buyer name highlighted', () => {
    renderTab()

    const heading = screen.getByRole('heading', {
      name: 'Users who can act on behalf of Donald Green',
    })

    expect(within(heading).getByText('Donald Green')).toBeInTheDocument()
  })

  it('puts the name after a custom heading that has no {name} token', () => {
    render(
      <DelegationTab
        userName="Donald Green"
        labels={{
          delegationSectionTitle: 'People covering for',
          actingForSectionTitle: 'People covered by',
        }}
      />
    )

    expect(
      screen.getByRole('heading', { name: 'People covering for Donald Green' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'People covered by Donald Green' })
    ).toBeInTheDocument()
  })

  it('shows no name in the headings when the buyer has none', () => {
    render(<DelegationTab />)

    expect(
      screen.getByRole('heading', { name: 'Users who can act on behalf of' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Users can act on behalf of' })
    ).toBeInTheDocument()
  })

  it('lists each delegation with the Delegate and its period', () => {
    renderTab()

    const [table] = screen.getAllByRole('table')
    const rows = within(table).getAllByRole('row').slice(1)

    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent)
    ).toEqual(['User', 'Start date', 'End date'])
    expect(rows).toHaveLength(2)
    expect(within(rows[0]).getByText('aturner')).toBeInTheDocument()
    expect(within(rows[0]).getByText('Nov 1, 2026')).toBeInTheDocument()
    expect(within(rows[0]).getByText('Dec 1, 2026')).toBeInTheDocument()
    expect(within(rows[1]).getByText('awilson')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Indefinite')).toBeInTheDocument()
  })

  describe('users the buyer can act on behalf of', () => {
    it('always shows its heading, with the buyer name highlighted', () => {
      setDelegations({ delegations: [], actingFor: [] })

      renderTab()

      const heading = screen.getByRole('heading', {
        name: 'Users Donald Green can act on behalf of',
      })

      expect(within(heading).getByText('Donald Green')).toBeInTheDocument()
    })

    it('lists them read-only: no Add button and no row menu', () => {
      renderTab()

      const table = screen.getAllByRole('table')[1]
      const rows = within(table).getAllByRole('row').slice(1)

      expect(rows).toHaveLength(2)
      expect(within(rows[0]).getByText('pburgos')).toBeInTheDocument()
      expect(within(rows[0]).getByText('Jul 8, 2026')).toBeInTheDocument()
      expect(within(rows[0]).getByText('Aug 8, 2026')).toBeInTheDocument()
      expect(within(rows[1]).getByText('qparker@acme.com')).toBeInTheDocument()
      expect(within(rows[1]).getByText('Indefinite')).toBeInTheDocument()
      expect(within(table).queryByRole('button')).not.toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: 'Add' })).toHaveLength(1)

      // Only the first list (where the buyer is the Original Shopper) has menus.
      expect(
        screen.getAllByRole('button', { name: 'More options' })
      ).toHaveLength(2)
    })

    it('shows "No users added" when nobody is listed, keeping the other list', () => {
      setDelegations({ actingFor: [] })

      renderTab()

      expect(screen.getAllByRole('table')).toHaveLength(1)
      expect(screen.getAllByText('No users added')).toHaveLength(1)
      expect(screen.getByText('aturner')).toBeInTheDocument()
    })

    it('hides its list (but not its heading) while loading or on error', () => {
      setDelegations({ delegations: [], actingFor: [], loading: true })

      renderTab()

      expect(
        screen.getByRole('heading', {
          name: 'Users Donald Green can act on behalf of',
        })
      ).toBeInTheDocument()
      expect(screen.queryByText('No users added')).not.toBeInTheDocument()
    })
  })

  it('shows a centered empty message and keeps the heading when there are no delegations', () => {
    setDelegations({ delegations: [], actingFor: [] })

    renderTab()

    expect(
      screen.getByRole('heading', {
        name: 'Users who can act on behalf of Donald Green',
      })
    ).toBeInTheDocument()
    expect(screen.getAllByText('No users added')).toHaveLength(2)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('shows an error state with retry and no partial list', () => {
    setDelegations({ error: new Error('boom') })

    renderTab()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'We could not load your delegations.'
    )
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it('shows neither list nor empty state while loading', () => {
    setDelegations({ delegations: [], actingFor: [], loading: true })

    renderTab()

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('No delegations yet')).not.toBeInTheDocument()
  })

  it('applies CMS label overrides', () => {
    render(<DelegationTab labels={{ addLabel: 'Invite' }} />)

    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument()
  })

  describe('row menu', () => {
    it('opens with Edit and Remove and closes with Escape', () => {
      renderTab()

      openRowMenu(0)

      expect(
        screen.getAllByRole('menuitem').map((item) => item.textContent)
      ).toEqual(['Edit', 'Remove'])

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('closes when clicking outside', () => {
      renderTab()

      openRowMenu(0)
      fireEvent.mouseDown(document.body)

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('toggles on the same button', () => {
      renderTab()

      openRowMenu(0)
      openRowMenu(0)

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  describe('add', () => {
    const openAdd = () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    }

    it('describes the action with the buyer name', () => {
      renderTab()
      openAdd()

      expect(getDrawer()).toHaveTextContent(
        'Choose someone to act on behalf of Donald Green for a set period, with full access to their permissions and content.'
      )
      expect(
        within(getDrawer()).getByRole('heading', { name: 'Add delegate' })
      ).toBeInTheDocument()
    })

    it('does not offer the Delegates that are already in the list', () => {
      renderTab()
      openAdd()

      fireEvent.focus(screen.getByRole('combobox'))

      expect(
        within(screen.getByRole('listbox'))
          .getAllByRole('option')
          .map((option) => option.textContent)
      ).toEqual(['cparkerc@acme.com', 'dsmith@acme.com'])
    })

    it('filters the users while typing', () => {
      renderTab()
      openAdd()

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'DSM' },
      })

      expect(
        within(screen.getByRole('listbox'))
          .getAllByRole('option')
          .map((option) => option.textContent)
      ).toEqual(['dsmith@acme.com'])
    })

    it('shows the selected user as a chip that can be cleared', () => {
      renderTab()
      openAdd()

      chooseCandidate('cparker')

      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(within(getDrawer()).getByText('cparker')).toBeInTheDocument()

      fireEvent.click(
        screen.getByRole('button', { name: 'Remove selected user' })
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('defaults the start date to today and the end date to empty', () => {
      renderTab()
      openAdd()

      const [start, end] = screen.getAllByLabelText(/date/i)

      expect(start).toHaveValue('2026-11-10')
      expect(end).toHaveValue('')
    })

    it('keeps Continue disabled until a user is chosen', () => {
      renderTab()
      openAdd()

      const continueButton = screen.getByRole('button', { name: 'Continue' })

      expect(continueButton).toBeDisabled()

      chooseCandidate('cparker')

      expect(continueButton).toBeEnabled()
    })

    it('shows each period error under its own field', () => {
      renderTab()
      openAdd()

      chooseCandidate('cparker')
      const [start, end] = screen.getAllByLabelText(/date/i)

      fireEvent.change(start, { target: { value: '' } })
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

      expect(start.closest('[data-fs-input-field]')).toHaveTextContent(
        'Select a start date.'
      )
      expect(end.closest('[data-fs-input-field]')).not.toHaveTextContent(
        'Select a start date.'
      )

      fireEvent.change(start, { target: { value: '2026-11-20' } })
      fireEvent.change(end, { target: { value: '2026-11-19' } })
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

      expect(end.closest('[data-fs-input-field]')).toHaveTextContent(
        'The end date cannot be earlier than the start date.'
      )
      expect(start.closest('[data-fs-input-field]')).not.toHaveTextContent(
        'The end date cannot'
      )
    })

    it('opens the calendar as soon as a date field is clicked', () => {
      const showPicker = vi.fn()
      Object.defineProperty(HTMLInputElement.prototype, 'showPicker', {
        configurable: true,
        value: showPicker,
      })

      renderTab()
      openAdd()

      const [start, end] = screen.getAllByLabelText(/date/i)
      fireEvent.click(start)
      fireEvent.click(end)

      expect(showPicker).toHaveBeenCalledTimes(2)
      expect(showPicker.mock.contexts).toEqual([start, end])

      Reflect.deleteProperty(HTMLInputElement.prototype, 'showPicker')
    })

    it('keeps working when the browser cannot open the calendar', () => {
      Object.defineProperty(HTMLInputElement.prototype, 'showPicker', {
        configurable: true,
        value: () => {
          throw new DOMException('already open', 'InvalidStateError')
        },
      })

      renderTab()
      openAdd()

      const [start] = screen.getAllByLabelText(/date/i)

      expect(() => fireEvent.click(start)).not.toThrow()
      expect(start).toHaveValue('2026-11-10')

      Reflect.deleteProperty(HTMLInputElement.prototype, 'showPicker')
    })

    it('blocks an end date earlier than the start date', () => {
      renderTab()
      openAdd()

      chooseCandidate('cparker')
      const [start, end] = screen.getAllByLabelText(/date/i)
      fireEvent.change(start, { target: { value: '2026-11-20' } })
      fireEvent.change(end, { target: { value: '2026-11-19' } })
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

      expect(getDrawer()).toHaveTextContent(
        'The end date cannot be earlier than the start date.'
      )
      expect(mockCreateDelegation).not.toHaveBeenCalled()
    })

    it('asks for confirmation before creating, then creates and refreshes', async () => {
      renderTab()
      openAdd()

      chooseCandidate('cparker')
      const [, end] = screen.getAllByLabelText(/date/i)
      fireEvent.change(end, { target: { value: '2026-12-31' } })
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

      expect(
        within(getDrawer()).getByRole('heading', { name: 'Confirm access' })
      ).toBeInTheDocument()
      expect(
        getDrawer().querySelector('[data-fs-delegation-confirm-intro]')
      ).toHaveTextContent(
        'cparker will be able to act on behalf of Donald Green from Nov 10, 2026 to Dec 31, 2026.'
      )
      expect(
        within(getDrawer())
          .getAllByRole('listitem')
          .map((item) => item.textContent)
      ).toEqual([
        'Sign in and act as Donald Green',
        'Access all their content, orders, and data',
        'Use all their roles and permissions',
      ])
      expect(mockCreateDelegation).not.toHaveBeenCalled()

      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

      await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
      expect(mockCreateDelegation).toHaveBeenCalledWith({
        delegateUserId: 'user-3',
        startDate: '2026-11-10',
        endDate: '2026-12-31',
      })
      expect(mockPushToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Delegate added successfully',
          status: 'INFO',
        })
      )
      expect(mockPushToast.mock.calls[0][0].title).toBeUndefined()
    })

    it('reads the same day for a one-day delegation', () => {
      renderTab()
      fireEvent.click(screen.getByRole('button', { name: 'Add' }))

      chooseCandidate('cparker')
      const [, end] = screen.getAllByLabelText(/date/i)
      fireEvent.change(end, { target: { value: '2026-11-10' } })
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

      expect(
        getDrawer().querySelector('[data-fs-delegation-confirm-intro]')
      ).toHaveTextContent(
        'cparker will be able to act on behalf of Donald Green from Nov 10, 2026 to Nov 10, 2026.'
      )
    })

    it('warns, without blocking, when the Delegate has fewer roles', async () => {
      mockUseDelegateRoleComparison.mockReturnValue({ hasFewerRoles: true })

      renderTab()
      fireEvent.click(screen.getByRole('button', { name: 'Add' }))

      chooseCandidate('cparker')
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

      expect(
        getDrawer().querySelector('[data-fs-delegation-confirm-warning]')
      ).toHaveTextContent(
        'cparker has fewer roles than Donald Green, so this grants access beyond their usual permissions.'
      )
      expect(mockUseDelegateRoleComparison).toHaveBeenLastCalledWith(
        'user-3',
        true
      )

      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

      await waitFor(() => expect(mockCreateDelegation).toHaveBeenCalledTimes(1))
    })

    it('shows no warning when the Delegate does not have fewer roles', () => {
      renderTab()
      fireEvent.click(screen.getByRole('button', { name: 'Add' }))

      chooseCandidate('cparker')
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

      expect(
        getDrawer().querySelector('[data-fs-delegation-confirm-warning]')
      ).toBeNull()
    })

    it('only compares roles once the confirmation step is open', () => {
      renderTab()
      fireEvent.click(screen.getByRole('button', { name: 'Add' }))

      chooseCandidate('cparker')

      expect(mockUseDelegateRoleComparison).toHaveBeenLastCalledWith(
        'user-3',
        false
      )
    })

    it('creates an open-ended delegation when the end date is empty', async () => {
      renderTab()
      openAdd()

      chooseCandidate('dsmith')
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

      expect(
        getDrawer().querySelector('[data-fs-delegation-confirm-intro]')
      ).toHaveTextContent(
        'dsmith@acme.com will be able to act on behalf of Donald Green from Nov 10, 2026, with no end date.'
      )

      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

      await waitFor(() => expect(mockCreateDelegation).toHaveBeenCalledTimes(1))
      expect(mockCreateDelegation).toHaveBeenCalledWith({
        delegateUserId: 'user-4',
        startDate: '2026-11-10',
        endDate: null,
      })
    })

    it('goes back from the confirmation step without creating anything', () => {
      renderTab()
      openAdd()

      chooseCandidate('cparker')
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
      fireEvent.click(screen.getAllByRole('button', { name: 'Back' })[0])

      expect(
        within(getDrawer()).getByRole('heading', { name: 'Add delegate' })
      ).toBeInTheDocument()
      expect(within(getDrawer()).getByText('cparker')).toBeInTheDocument()
      expect(mockCreateDelegation).not.toHaveBeenCalled()
    })

    it('shows an error toast and keeps the list untouched when the API fails', async () => {
      mockCreateDelegation.mockRejectedValueOnce(new Error('identity down'))
      vi.spyOn(console, 'error').mockImplementation(() => {})

      renderTab()
      openAdd()

      chooseCandidate('cparker')
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

      await waitFor(() =>
        expect(mockPushToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Something went wrong',
            status: 'ERROR',
          })
        )
      )
      expect(refresh).not.toHaveBeenCalled()
    })

    it('explains when nobody is left to be added', () => {
      mockUseDelegateCandidates.mockReturnValue({
        candidates: [],
        loading: false,
        error: null,
      })

      renderTab()
      openAdd()

      expect(
        screen.getByText('There are no users available to be added.')
      ).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
    })

    it('shows a loading state on the confirm button until the API answers', async () => {
      let finish: (value: unknown) => void = () => {}
      mockCreateDelegation.mockReturnValueOnce(
        new Promise((resolve) => {
          finish = resolve
        })
      )

      renderTab()
      openAdd()

      chooseCandidate('cparker')
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

      const loading = await screen.findByRole('button', {
        name: 'Confirming...',
      })

      expect(loading).toBeDisabled()
      expect(loading).toHaveAttribute('aria-busy', 'true')
      // The header arrow and the footer button are both locked while waiting.
      for (const back of screen.getAllByRole('button', { name: 'Back' })) {
        expect(back).toBeDisabled()
      }
      expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled()

      // A second click while waiting does not send another request.
      fireEvent.click(loading)
      expect(mockCreateDelegation).toHaveBeenCalledTimes(1)

      finish({ data: { createDelegation: true } })

      await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
    })

    it('goes back to the idle button when the API fails', async () => {
      mockCreateDelegation.mockRejectedValueOnce(new Error('identity down'))
      vi.spyOn(console, 'error').mockImplementation(() => {})

      renderTab()
      openAdd()

      chooseCandidate('cparker')
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled()
      )
    })

    it('closes the drawer with Cancel', () => {
      renderTab()
      openAdd()

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('edit', () => {
    const openEdit = (rowIndex: number) => {
      openRowMenu(rowIndex)
      fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }))
    }

    it('changes only the end date', async () => {
      renderTab()
      openEdit(0)

      expect(
        within(getDrawer()).getByRole('heading', { name: 'Edit delegate' })
      ).toBeInTheDocument()

      const [start, end] = screen.getAllByLabelText(/date/i)
      expect(start).toHaveValue('2026-11-01')
      expect(end).toHaveValue('2026-12-01')

      fireEvent.change(end, { target: { value: '2026-12-15' } })
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))

      await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
      expect(mockUpdateDelegation).toHaveBeenCalledWith('del-1', {
        startDate: null,
        endDate: '2026-12-15',
      })
      expect(mockPushToast).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Delegation updated successfully' })
      )
    })

    it('can set an end date on an open-ended delegation', async () => {
      renderTab()
      openEdit(1)

      const [, end] = screen.getAllByLabelText(/date/i)
      fireEvent.change(end, { target: { value: '2026-11-30' } })
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))

      await waitFor(() => expect(mockUpdateDelegation).toHaveBeenCalledTimes(1))
      expect(mockUpdateDelegation).toHaveBeenCalledWith('del-2', {
        startDate: null,
        endDate: '2026-11-30',
      })
    })

    it('shows a saving state until the API answers', async () => {
      let finish: (value: unknown) => void = () => {}
      mockUpdateDelegation.mockReturnValueOnce(
        new Promise((resolve) => {
          finish = resolve
        })
      )

      renderTab()
      openEdit(0)

      const [, end] = screen.getAllByLabelText(/date/i)
      fireEvent.change(end, { target: { value: '2026-12-15' } })
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))

      expect(
        await screen.findByRole('button', { name: 'Saving...' })
      ).toBeDisabled()

      finish({ data: { updateDelegation: true } })

      await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
    })

    it('does not call the API when nothing changed', () => {
      renderTab()
      openEdit(0)

      fireEvent.click(screen.getByRole('button', { name: 'Save' }))

      expect(mockUpdateDelegation).not.toHaveBeenCalled()
      expect(refresh).not.toHaveBeenCalled()
    })

    it('does not let an existing end date be cleared', () => {
      renderTab()
      openEdit(0)

      const [, end] = screen.getAllByLabelText(/date/i)
      fireEvent.change(end, { target: { value: '' } })
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))

      expect(getDrawer()).toHaveTextContent(
        'An existing end date cannot be removed.'
      )
      expect(mockUpdateDelegation).not.toHaveBeenCalled()
    })

    it('blocks an end date in the past', () => {
      renderTab()
      openEdit(0)

      const [, end] = screen.getAllByLabelText(/date/i)
      fireEvent.change(end, { target: { value: '2026-11-09' } })
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))

      expect(getDrawer()).toHaveTextContent(
        'The end date cannot be in the past.'
      )
      expect(mockUpdateDelegation).not.toHaveBeenCalled()
    })

    it('shows the Delegate read-only, without a way to change it', () => {
      renderTab()
      openEdit(0)

      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Remove selected user' })
      ).not.toBeInTheDocument()
      expect(within(getDrawer()).getByText('aturner')).toBeInTheDocument()
    })
  })

  describe('remove', () => {
    const clickRemove = (rowIndex: number) => {
      openRowMenu(rowIndex)
      fireEvent.click(screen.getByRole('menuitem', { name: 'Remove' }))
    }

    it('removes right away from the row menu, with no confirmation step', async () => {
      renderTab()

      clickRemove(1)

      await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(mockRevokeDelegation).toHaveBeenCalledTimes(1)
      expect(mockRevokeDelegation).toHaveBeenCalledWith('del-2')
    })

    it('confirms with a single-line toast, without a title', async () => {
      renderTab()

      clickRemove(0)

      await waitFor(() => expect(mockPushToast).toHaveBeenCalledTimes(1))
      expect(mockPushToast).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'INFO',
          message: 'Delegate removed successfully',
        })
      )
      expect(mockPushToast.mock.calls[0][0].title).toBeUndefined()
    })

    it('shows an error toast and keeps the list when the API fails', async () => {
      mockRevokeDelegation.mockRejectedValueOnce(new Error('identity down'))
      vi.spyOn(console, 'error').mockImplementation(() => {})

      renderTab()
      clickRemove(0)

      await waitFor(() =>
        expect(mockPushToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Something went wrong',
            status: 'ERROR',
          })
        )
      )
      expect(refresh).not.toHaveBeenCalled()
    })

    it('ignores a second removal while the first one is in flight', async () => {
      let finish: (value: unknown) => void = () => {}
      mockRevokeDelegation.mockReturnValueOnce(
        new Promise((resolve) => {
          finish = resolve
        })
      )

      renderTab()
      clickRemove(0)
      clickRemove(1)

      expect(mockRevokeDelegation).toHaveBeenCalledTimes(1)
      expect(mockRevokeDelegation).toHaveBeenCalledWith('del-1')

      finish({ data: { revokeDelegation: true } })
      await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
    })
  })
})
