import {
  getOrderStatusLabel,
  type OrderStatusCmsLabels,
  type OrderStatusKey,
} from 'src/utils/userOrderStatus'
import type { OrderStatusSectionLabels } from '../orderDetailsLabels'

export type StepStatus = 'completed' | 'loading' | 'not-started' | 'failed'
export type StepKey =
  | 'order'
  | 'approval'
  | 'payment'
  | 'processing'
  | 'shipping'

export function getStepLabel(
  stepKey: StepKey,
  stepStatus: StepStatus,
  labels: Required<OrderStatusSectionLabels>
): string {
  const stepLabels: Record<StepKey, Record<StepStatus, string>> = {
    order: {
      completed: labels.orderPlacedStep,
      loading: labels.orderPlacedStep,
      'not-started': labels.orderPlacedStep,
      failed: labels.orderPlacedStep,
    },
    approval: {
      completed: labels.approvedStep,
      loading: labels.pendingApprovalStep,
      'not-started': labels.pendingApprovalStep,
      failed: labels.deniedStep,
    },
    payment: {
      completed: labels.paymentApprovedStep,
      loading: labels.paymentPendingStep,
      'not-started': labels.paymentAuthorizationStep,
      failed: labels.paymentDeniedStep,
    },
    processing: {
      completed: labels.readyForDeliveryStep,
      loading: labels.handlingStep,
      'not-started': labels.handlingStep,
      failed: labels.canceledStep,
    },
    shipping: {
      completed: labels.invoicedStep,
      loading: labels.deliveredStep,
      'not-started': labels.shipOrderStep,
      failed: labels.canceledStep,
    },
  }

  return stepLabels[stepKey][stepStatus]
}

export function getDisplayStepLabel({
  stepKey,
  stepStatus,
  labels,
  status,
  statusLabels,
  isCanceled,
}: {
  stepKey: StepKey
  stepStatus: StepStatus
  labels: Required<OrderStatusSectionLabels>
  status: OrderStatusKey
  statusLabels?: OrderStatusCmsLabels
  isCanceled: boolean
}): string {
  if (isCanceled) {
    return stepKey === 'payment'
      ? getOrderStatusLabel({ status, cmsLabels: statusLabels })
      : '—'
  }

  if (
    stepStatus === 'failed' &&
    (stepKey === 'processing' || stepKey === 'shipping')
  ) {
    return getOrderStatusLabel({
      status: 'canceled',
      cmsLabels: statusLabels,
      statusFallback: labels.canceledStep,
    })
  }

  if (stepStatus === 'failed' && stepKey === 'payment') {
    return getOrderStatusLabel({
      status,
      cmsLabels: statusLabels,
      statusFallback: labels.paymentDeniedStep,
    })
  }

  return getStepLabel(stepKey, stepStatus, labels)
}

export function formatDate(date: string, locale: string) {
  const dateObj = new Date(date)

  return {
    date: new Intl.DateTimeFormat(locale, {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(dateObj),
    time: new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(dateObj),
  }
}
