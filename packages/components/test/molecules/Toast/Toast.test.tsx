import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

import { Toast } from '../../../src/index'
import { useUI } from '../../../src/hooks'

vi.mock('../../../src/hooks', () => ({
  useUI: vi.fn(),
}))

const mockedUseUI = vi.mocked(useUI)

const popToast = vi.fn()

afterEach(() => {
  popToast.mockClear()
  mockedUseUI.mockReset()
  cleanup()
})

describe('Toast', () => {
  it('renders nothing when there are no toasts', () => {
    mockedUseUI.mockReturnValue({
      toasts: [],
      popToast,
    } as unknown as ReturnType<typeof useUI>)

    const { container } = render(<Toast />)

    expect(container.firstChild).toBeNull()
  })

  it('renders the latest toast message with role="status"', () => {
    mockedUseUI.mockReturnValue({
      toasts: [{ message: 'Hello world', status: 'INFO' }],
      popToast,
    } as unknown as ReturnType<typeof useUI>)

    render(<Toast />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders the optional toast title alongside the message', () => {
    mockedUseUI.mockReturnValue({
      toasts: [{ message: 'Body copy', status: 'INFO', title: 'Heads up' }],
      popToast,
    } as unknown as ReturnType<typeof useUI>)

    render(<Toast />)

    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Body copy')).toBeInTheDocument()
  })

  it('renders a custom icon container when icon is provided', () => {
    mockedUseUI.mockReturnValue({
      toasts: [
        {
          message: 'With icon',
          status: 'INFO',
          icon: <span data-testid="custom-icon">i</span>,
        },
      ],
      popToast,
    } as unknown as ReturnType<typeof useUI>)

    render(<Toast />)

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders only the latest toast when multiple are queued', () => {
    mockedUseUI.mockReturnValue({
      toasts: [
        { message: 'first', status: 'INFO' },
        { message: 'second', status: 'WARNING' },
      ],
      popToast,
    } as unknown as ReturnType<typeof useUI>)

    render(<Toast />)

    expect(screen.queryByText('first')).not.toBeInTheDocument()
    expect(screen.getByText('second')).toBeInTheDocument()
  })

  it('should not fail any accessibility tests', async () => {
    mockedUseUI.mockReturnValue({
      toasts: [{ message: 'Accessible toast', status: 'INFO' }],
      popToast,
    } as unknown as ReturnType<typeof useUI>)

    const { container } = render(<Toast />)

    // @ts-expect-error - vitest-axe matcher typings
    expect(await axe(container)).toHaveNoViolations()
  })
})
