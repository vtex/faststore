/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

const mockUseAuth = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/auth', () => ({ useAuth: mockUseAuth }))

import ProfileChallenge from '../../../src/components/auth/ProfileChallenge/ProfileChallenge'

describe('ProfileChallenge', () => {
  it('renders children when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true })

    render(
      <ProfileChallenge>
        <span>Protected content</span>
      </ProfileChallenge>
    )

    expect(screen.queryByText('Protected content')).not.toBeNull()
  })

  it('renders fallback when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false })

    render(
      <ProfileChallenge fallback={<span>Please log in</span>}>
        <span>Protected content</span>
      </ProfileChallenge>
    )

    expect(screen.queryByText('Please log in')).not.toBeNull()
    expect(screen.queryByText('Protected content')).toBeNull()
  })

  it('renders nothing by default when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false })

    render(
      <ProfileChallenge>
        <span>Protected content</span>
      </ProfileChallenge>
    )

    expect(screen.queryByText('Protected content')).toBeNull()
  })
})
