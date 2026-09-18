/**
 * @vitest-environment jsdom
 */

import { UIProvider } from '@faststore/ui'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { ProcessOrderAuthorizationRule } from '@generated/graphql'

vi.mock('src/sdk/account/useOrderAuthorization', () => ({
  useOrderAuthorization: () => ({
    processOrderAuthorization: vi.fn(),
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

function openRejectModal() {
  fireEvent.click(screen.getByText('Reject'))
}

function getModalTitle() {
  return document.querySelector('[data-fs-modal-header-title]')?.textContent
}

function getModalMessage() {
  return document.querySelector('[data-fs-order-details-action-modal-message]')
    ?.textContent
}

describe('BuyingPolicyAlert', () => {
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
})
