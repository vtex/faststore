/**
 * @vitest-environment jsdom
 */

import { UIProvider, useUI } from '@faststore/ui'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ProcessOrderAuthorizationRule } from '@generated/graphql'

const mockProcessOrderAuthorization = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/account/useOrderAuthorization', () => ({
  useOrderAuthorization: () => ({
    processOrderAuthorization: mockProcessOrderAuthorization,
    data: null,
    error: null,
    loading: false,
  }),
}))

import BuyingPolicyAlert from 'src/components/account/orders/OrderDetails/BuyingPolicyAlert'

const ruleForAuthorization = {
  orderAuthorizationId: 'auth-1',
  dimensionId: 'dim-1',
  rule: { id: 'rule-1', name: 'Approval Policy' },
} as unknown as ProcessOrderAuthorizationRule

/** Renders the last pushed toast message so tests can assert on it. */
function ToastPreview() {
  const { toasts } = useUI()
  const lastToast = toasts[toasts.length - 1]

  return (
    <div data-testid="toast-preview" data-toast-status={lastToast?.status}>
      {lastToast?.message}
    </div>
  )
}

function openRejectModal() {
  fireEvent.click(screen.getByText('Reject'))
}

function confirmRejectModal() {
  const dialog = within(screen.getByRole('dialog'))
  fireEvent.click(dialog.getByRole('button', { name: /reject/i }))
}

function getModalTitle() {
  return document.querySelector('[data-fs-modal-header-title]')?.textContent
}

function getModalMessage() {
  return document.querySelector('[data-fs-order-details-action-modal-message]')
    ?.textContent
}

describe('BuyingPolicyAlert', () => {
  beforeEach(() => {
    mockProcessOrderAuthorization.mockReset()
  })

  it('opens the reject confirmation modal with the default English copy', () => {
    render(
      <UIProvider>
        <BuyingPolicyAlert ruleForAuthorization={ruleForAuthorization} />
      </UIProvider>
    )

    openRejectModal()

    expect(getModalTitle()).toBe('Reject approval request')
    expect(getModalMessage()).toContain(
      "You're about to reject this approval request, triggered by the Approval Policy policy."
    )
  })

  it('opens the reject confirmation modal with CMS-provided labels', () => {
    render(
      <UIProvider>
        <BuyingPolicyAlert
          ruleForAuthorization={ruleForAuthorization}
          labels={{
            rejectModalTitle: 'Rejeitar solicitação de aprovação',
            rejectModalMessage: 'Você está rejeitando a política {policy}.',
            rejectModalConfirmText: 'Confirmar rejeição',
          }}
        />
      </UIProvider>
    )

    openRejectModal()

    expect(getModalTitle()).toBe('Rejeitar solicitação de aprovação')
    expect(getModalMessage()).toBe(
      'Você está rejeitando a política Approval Policy.'
    )
    expect(
      screen.getByRole('button', { name: 'Confirmar rejeição' })
    ).toBeTruthy()
  })

  it('shows the default English toast when a policy is approved', async () => {
    mockProcessOrderAuthorization.mockResolvedValueOnce({})

    render(
      <UIProvider>
        <BuyingPolicyAlert ruleForAuthorization={ruleForAuthorization} />
        <ToastPreview />
      </UIProvider>
    )

    fireEvent.click(screen.getByText('Approve'))

    expect(
      await screen.findByText('Approval Policy policy approved successfully.')
    ).toBeTruthy()
  })

  it('shows the CMS-provided toast when a policy is approved', async () => {
    mockProcessOrderAuthorization.mockResolvedValueOnce({})

    render(
      <UIProvider>
        <BuyingPolicyAlert
          ruleForAuthorization={ruleForAuthorization}
          labels={{
            approveSuccessToast: 'Política {policy} aprovada com sucesso.',
          }}
        />
        <ToastPreview />
      </UIProvider>
    )

    fireEvent.click(screen.getByText('Approve'))

    expect(
      await screen.findByText('Política Approval Policy aprovada com sucesso.')
    ).toBeTruthy()
  })

  it('replaces every policy placeholder without interpreting replacement patterns', async () => {
    mockProcessOrderAuthorization.mockResolvedValueOnce({})
    const policyName = '$& Policy'

    render(
      <UIProvider>
        <BuyingPolicyAlert
          ruleForAuthorization={
            {
              ...ruleForAuthorization,
              rule: { ...ruleForAuthorization.rule, name: policyName },
            } as ProcessOrderAuthorizationRule
          }
          labels={{
            approveSuccessToast: '{policy} approved by {policy}.',
          }}
        />
        <ToastPreview />
      </UIProvider>
    )

    fireEvent.click(screen.getByText('Approve'))

    expect(
      await screen.findByText('$& Policy approved by $& Policy.')
    ).toBeTruthy()
  })

  it('shows the default English error toast when approving a policy fails', async () => {
    mockProcessOrderAuthorization.mockRejectedValueOnce(new Error('failure'))

    render(
      <UIProvider>
        <BuyingPolicyAlert ruleForAuthorization={ruleForAuthorization} />
        <ToastPreview />
      </UIProvider>
    )

    fireEvent.click(screen.getByText('Approve'))

    expect(
      await screen.findByText(
        "Policy couldn't be approved due to a technical issue."
      )
    ).toBeTruthy()
  })

  it('shows the CMS-provided error toast when approving a policy fails', async () => {
    mockProcessOrderAuthorization.mockRejectedValueOnce(new Error('failure'))

    render(
      <UIProvider>
        <BuyingPolicyAlert
          ruleForAuthorization={ruleForAuthorization}
          labels={{
            approveErrorToast: 'Não foi possível aprovar a política.',
          }}
        />
        <ToastPreview />
      </UIProvider>
    )

    fireEvent.click(screen.getByText('Approve'))

    expect(
      await screen.findByText('Não foi possível aprovar a política.')
    ).toBeTruthy()
  })

  it('shows the default English toast when a policy is rejected', async () => {
    mockProcessOrderAuthorization.mockResolvedValueOnce({})

    render(
      <UIProvider>
        <BuyingPolicyAlert ruleForAuthorization={ruleForAuthorization} />
        <ToastPreview />
      </UIProvider>
    )

    openRejectModal()
    confirmRejectModal()

    expect(
      await screen.findByText(
        'Approval Policy policy rejected successfully. Order denied.'
      )
    ).toBeTruthy()
  })

  it('shows the CMS-provided toast when a policy is rejected', async () => {
    mockProcessOrderAuthorization.mockResolvedValueOnce({})

    render(
      <UIProvider>
        <BuyingPolicyAlert
          ruleForAuthorization={ruleForAuthorization}
          labels={{
            rejectSuccessToast: 'Política {policy} rejeitada. Pedido negado.',
          }}
        />
        <ToastPreview />
      </UIProvider>
    )

    openRejectModal()
    confirmRejectModal()

    expect(
      await screen.findByText(
        'Política Approval Policy rejeitada. Pedido negado.'
      )
    ).toBeTruthy()
  })

  it('shows the default English error toast when rejecting a policy fails', async () => {
    mockProcessOrderAuthorization.mockRejectedValueOnce(new Error('failure'))

    render(
      <UIProvider>
        <BuyingPolicyAlert ruleForAuthorization={ruleForAuthorization} />
        <ToastPreview />
      </UIProvider>
    )

    openRejectModal()
    confirmRejectModal()

    expect(
      await screen.findByText(
        "Policy couldn't be rejected due to a technical issue."
      )
    ).toBeTruthy()
  })

  it('shows the CMS-provided error toast when rejecting a policy fails', async () => {
    mockProcessOrderAuthorization.mockRejectedValueOnce(new Error('failure'))

    render(
      <UIProvider>
        <BuyingPolicyAlert
          ruleForAuthorization={ruleForAuthorization}
          labels={{
            rejectErrorToast: 'Não foi possível rejeitar a política.',
          }}
        />
        <ToastPreview />
      </UIProvider>
    )

    openRejectModal()
    confirmRejectModal()

    expect(
      await screen.findByText('Não foi possível rejeitar a política.')
    ).toBeTruthy()
  })
})
