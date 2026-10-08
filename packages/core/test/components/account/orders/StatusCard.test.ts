import { describe, expect, it } from 'vitest'

import {
  defaultOrderStatusLabels,
  resolveOrderStatusLabels,
} from '../../../../src/components/account/orders/OrderDetails/orderDetailsLabels'
import {
  formatDate,
  getDisplayStepLabel,
  getStepLabel,
  type StepKey,
  type StepStatus,
} from '../../../../src/components/account/orders/OrderDetails/StatusCard/statusCardLocalization'

describe('StatusCard localization', () => {
  it('resolves every timeline state from configurable labels', () => {
    const labels = resolveOrderStatusLabels(
      Object.fromEntries(
        Object.keys(defaultOrderStatusLabels).map((key) => [key, `i18n:${key}`])
      )
    )
    const combinations: [StepKey, StepStatus, string][] = [
      ['order', 'completed', 'orderPlacedStep'],
      ['approval', 'completed', 'approvedStep'],
      ['approval', 'loading', 'pendingApprovalStep'],
      ['approval', 'failed', 'deniedStep'],
      ['payment', 'completed', 'paymentApprovedStep'],
      ['payment', 'loading', 'paymentPendingStep'],
      ['payment', 'not-started', 'paymentAuthorizationStep'],
      ['payment', 'failed', 'paymentDeniedStep'],
      ['processing', 'completed', 'readyForDeliveryStep'],
      ['processing', 'loading', 'handlingStep'],
      ['processing', 'failed', 'canceledStep'],
      ['shipping', 'completed', 'invoicedStep'],
      ['shipping', 'loading', 'deliveredStep'],
      ['shipping', 'not-started', 'shipOrderStep'],
      ['shipping', 'failed', 'canceledStep'],
    ]

    for (const [step, status, labelKey] of combinations) {
      expect(getStepLabel(step, status, labels)).toBe(`i18n:${labelKey}`)
    }
  })

  it('uses CMS status labels for canceled and failed timeline copy', () => {
    const labels = resolveOrderStatusLabels()
    const statusLabels = {
      canceledStatus: 'Cancelado',
      paymentDeniedStatus: 'Pagamento recusado',
    }

    expect(
      getDisplayStepLabel({
        stepKey: 'payment',
        stepStatus: 'failed',
        labels,
        status: 'canceled',
        statusLabels,
        isCanceled: true,
      })
    ).toBe('Cancelado')

    expect(
      getDisplayStepLabel({
        stepKey: 'shipping',
        stepStatus: 'failed',
        labels,
        status: 'canceled',
        statusLabels,
        isCanceled: false,
      })
    ).toBe('Cancelado')

    expect(
      getDisplayStepLabel({
        stepKey: 'payment',
        stepStatus: 'failed',
        labels,
        status: 'payment-denied',
        statusLabels,
        isCanceled: false,
      })
    ).toBe('Pagamento recusado')
  })

  it('formats timeline dates and times using the active locale', () => {
    const timestamp = '2026-08-05T18:30:00.000Z'

    expect(formatDate(timestamp, 'pt-BR')).toEqual({
      date: new Intl.DateTimeFormat('pt-BR', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }).format(new Date(timestamp)),
      time: new Intl.DateTimeFormat('pt-BR', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(timestamp)),
    })
  })
})
