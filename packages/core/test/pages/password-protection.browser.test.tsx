/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import React from 'react'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest'

const mockUseRouter = vi.hoisted(() => vi.fn())

vi.mock('next/router', () => ({
  useRouter: mockUseRouter,
}))

vi.mock('next/head', () => ({
  default: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

vi.mock(
  '@faststore/ui',
  () => ({
    Button: ({
      children,
      loading,
      ...props
    }: React.PropsWithChildren<
      React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
    >) => (
      <button {...props} aria-busy={loading}>
        {children}
      </button>
    ),
    InputField: ({
      label,
      error,
      ...props
    }: React.InputHTMLAttributes<HTMLInputElement> & {
      label: string
      error?: string
    }) => (
      <label htmlFor={props.id}>
        {label}
        <input {...props} />
        {error && <span role="alert">{error}</span>}
      </label>
    ),
  }),
  { virtual: true }
)

import PasswordProtectionLogin from '../../src/pages/password-protection'

const originalLocation = window.location

function stubLocation(origin = 'https://store.example.com') {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, origin, href: origin },
  })
}

function fillAndSubmit(password = 'secret') {
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: password },
  })
  fireEvent.submit(screen.getByRole('button', { name: 'Unlock' }))
}

describe('PasswordProtectionLogin', () => {
  beforeEach(() => {
    stubLocation()
    mockUseRouter.mockReturnValue({ query: {} })
    global.fetch = vi.fn()
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('renders the password protection form', () => {
    render(<PasswordProtectionLogin />)

    expect(
      screen.queryByText('This store is password protected')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Enter the password to access the store')
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Password')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Unlock' })).toBeInTheDocument()
  })

  it('posts the password and redirects to the requested return path', async () => {
    mockUseRouter.mockReturnValue({
      query: { returnTo: '/checkout?step=cart' },
    })
    ;(global.fetch as Mock).mockResolvedValue({
      json: async () => ({
        success: true,
        redirectUrl: '/checkout?step=cart',
      }),
    })

    render(<PasswordProtectionLogin />)
    fillAndSubmit()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    const [requestUrl, requestInit] = (global.fetch as Mock).mock.calls[0]
    const url = new URL(requestUrl)

    expect(url.pathname).toBe('/api/fs/password-protection/unlock')
    expect(url.searchParams.get('returnTo')).toBe('/checkout?step=cart')
    expect(requestInit).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'secret' }),
    })
    expect(window.location.href).toBe('/checkout?step=cart')
  })

  it('defaults returnTo to root and shows API validation errors', async () => {
    mockUseRouter.mockReturnValue({ query: { returnTo: ['/unsafe'] } })
    ;(global.fetch as Mock).mockResolvedValue({
      json: async () => ({
        success: false,
        error: 'Invalid password',
      }),
    })

    render(<PasswordProtectionLogin />)
    fillAndSubmit('wrong')

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Invalid password'
    )

    const [requestUrl] = (global.fetch as Mock).mock.calls[0]
    expect(new URL(requestUrl).searchParams.get('returnTo')).toBe('/')
  })

  it('uses the fallback invalid-password message when API omits an error', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      json: async () => ({ success: false }),
    })

    render(<PasswordProtectionLogin />)
    fillAndSubmit()

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Invalid password'
    )
  })

  it('shows service unavailable when the response is not a login payload', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      json: async () => null,
    })

    render(<PasswordProtectionLogin />)
    fillAndSubmit()

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Service temporarily unavailable'
    )
  })

  it('shows service unavailable when the login request fails', async () => {
    ;(global.fetch as Mock).mockRejectedValue(new Error('network'))

    render(<PasswordProtectionLogin />)
    fillAndSubmit()

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Service temporarily unavailable'
    )
  })
})
