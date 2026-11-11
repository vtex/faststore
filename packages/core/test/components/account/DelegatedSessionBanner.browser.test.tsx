/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
const mockDoLogout = vi.hoisted(() => vi.fn())
const mockReturnToDelegate = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))
vi.mock('src/sdk/account/useDelegatedSession', () => ({
  useDelegatedSession: () => ({
    returnToDelegate: mockReturnToDelegate,
    loading: false,
  }),
}))
vi.mock(
  'src/components/account/Drawer/OrganizationDrawer/OrganizationDrawer',
  () => ({ doLogout: mockDoLogout })
)

import { DelegatedSessionBanner } from '../../../src/components/account/DelegatedSessionBanner/DelegatedSessionBanner'
import { DelegatedSessionError } from '../../../src/sdk/account/startDelegatedSession'

const impersonating = () =>
  mockUseSession.mockReturnValue({
    b2b: { actorId: 'd', actorIdentifier: 'dgreen', userName: 'M Chen' },
  })

describe('DelegatedSessionBanner', () => {
  beforeEach(() => {
    mockDoLogout.mockReset()
    mockReturnToDelegate.mockReset()
  })

  it('renders nothing in a regular session', () => {
    mockUseSession.mockReturnValue({ b2b: { actorId: null } })
    const { container } = render(<DelegatedSessionBanner />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing without a b2b session', () => {
    mockUseSession.mockReturnValue({ b2b: null })
    const { container } = render(<DelegatedSessionBanner />)
    expect(container).toBeEmptyDOMElement()
  })

  it('names the Delegate and the Original Shopper', () => {
    mockUseSession.mockReturnValue({
      b2b: {
        actorId: 'delegate-1',
        actorIdentifier: 'dgreen',
        userName: 'M Chen',
        userEmail: 'mchen@stellar.com',
      },
    })
    render(<DelegatedSessionBanner />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'dgreen acting on behalf of M Chen'
    )
  })

  it('falls back to the actor id and the email', () => {
    mockUseSession.mockReturnValue({
      b2b: {
        actorId: 'delegate-1',
        actorIdentifier: null,
        userName: ' ',
        userEmail: 'mchen@stellar.com',
      },
    })
    render(<DelegatedSessionBanner />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'delegate-1 acting on behalf of mchen@stellar.com'
    )
  })

  it('returns the Delegate to their own session through the Return API', async () => {
    impersonating()
    mockReturnToDelegate.mockResolvedValue(true)
    render(<DelegatedSessionBanner />)

    fireEvent.click(screen.getByRole('button', { name: 'Return' }))

    await waitFor(() => expect(mockReturnToDelegate).toHaveBeenCalledTimes(1))
    expect(mockDoLogout).not.toHaveBeenCalled()
  })

  it('falls back to logout while the Return API is not available yet', async () => {
    impersonating()
    mockReturnToDelegate.mockImplementation(
      async (onFailure: (error: Error) => Promise<void>) => {
        await onFailure(new DelegatedSessionError('not available', 501))
        return false
      }
    )
    render(<DelegatedSessionBanner />)

    fireEvent.click(screen.getByRole('button', { name: 'Return' }))

    await waitFor(() => expect(mockDoLogout).toHaveBeenCalledTimes(1))
  })

  it('does not log out on any other failure', async () => {
    impersonating()
    mockReturnToDelegate.mockImplementation(
      async (onFailure: (error: Error) => Promise<void>) => {
        await onFailure(new DelegatedSessionError('upstream failed', 502))
        return false
      }
    )
    render(<DelegatedSessionBanner />)

    fireEvent.click(screen.getByRole('button', { name: 'Return' }))

    await waitFor(() => expect(mockReturnToDelegate).toHaveBeenCalledTimes(1))
    expect(mockDoLogout).not.toHaveBeenCalled()
  })
})
