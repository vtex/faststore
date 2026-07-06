/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

vi.mock('../../../src/components/account/Menu', () => ({
  __esModule: true,
  default: ({ items }: { items: Array<{ title: string; route: string }> }) => (
    <ul>
      {items.map((item) => (
        <li key={item.route}>{item.title}</li>
      ))}
    </ul>
  ),
}))

import Layout from '../../../src/components/account/Layout/Layout'

describe('Layout', () => {
  it('hides the Quotes route when the user is not an org member', () => {
    mockUseSession.mockReturnValue({ b2b: null })

    render(<Layout accountName="Jane Doe">content</Layout>)

    expect(screen.queryByText('Quotes')).toBeNull()
    expect(screen.getByText('Profile')).toBeTruthy()
  })

  it('shows the Quotes route when the user belongs to an org unit', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

    render(<Layout accountName="Jane Doe">content</Layout>)

    expect(screen.getByText('Quotes')).toBeTruthy()
  })

  it('hides User Details when not a representative, regardless of org membership', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

    render(
      <Layout accountName="Jane Doe" isRepresentative={false}>
        content
      </Layout>
    )

    expect(screen.queryByText('User Details')).toBeNull()
    expect(screen.getByText('Quotes')).toBeTruthy()
  })

  it('renders children inside the layout content area', () => {
    mockUseSession.mockReturnValue({ b2b: null })

    render(<Layout accountName="Jane Doe">child content</Layout>)

    expect(screen.getByText('child content')).toBeTruthy()
  })
})
