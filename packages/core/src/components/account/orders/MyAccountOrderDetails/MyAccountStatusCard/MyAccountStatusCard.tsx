import { Icon as UIIcon } from '@faststore/ui'
import React from 'react'
import MyAccountCard from 'src/components/account/components/MyAccountCard'

export type StepStatus = 'completed' | 'loading' | 'not-started' | 'failed'
export type StepKey =
  | 'order'
  | 'approval'
  | 'payment'
  | 'processing'
  | 'delivery'
  | 'shipping'

export type ApiOrderStatus = keyof typeof STATUS_MAPPING

interface Step {
  label: string
  status: StepStatus
  completedAt?: string
}

interface MyAccountStatusCardProps {
  status: ApiOrderStatus
}

const APPROVAL_LABELS: Record<StepStatus, string> = {
  completed: 'Order approved',
  loading: 'Approval pending',
  'not-started': 'Approval pending',
  failed: 'Order denied',
}

const PAYMENT_LABELS: Record<StepStatus, string> = {
  completed: 'Payment approved',
  loading: 'Payment pending',
  'not-started': 'Payment authorization',
  failed: 'Payment denied',
}

const PROCESSING_LABELS: Record<StepStatus, string> = {
  completed: 'Ready for shipping',
  loading: 'Handling order',
  'not-started': 'Handling order',
  failed: 'Order canceled',
}

const SHIPPING_LABELS: Record<StepStatus, string> = {
  completed: 'Invoiced',
  loading: 'Shipping order',
  'not-started': 'Ship order',
  failed: 'Order canceled',
}

const VISUAL_STEPS = [
  {
    label: (stepStatus: StepStatus) => APPROVAL_LABELS[stepStatus],
    key: 'approval',
  },
  { label: (_: StepStatus) => 'Order Placed', key: 'order' },
  {
    label: (stepStatus: StepStatus) => PAYMENT_LABELS[stepStatus],
    key: 'payment',
  },
  {
    label: (stepStatus: StepStatus) => PROCESSING_LABELS[stepStatus],
    key: 'processing',
  },
  {
    label: (stepStatus: StepStatus) => SHIPPING_LABELS[stepStatus],
    key: 'shipping',
  },
] as const

const STATUS_MAPPING = {
  // Approval steps
  null: 'approval',
  'pending-approval': 'approval',
  denied: 'approval',
  cancel: 'approval',

  // Order steps
  'order-created': 'order',
  'order-accepted': 'order',

  // Payment steps
  'payment-pending': 'payment',
  'payment-denied': 'payment',
  'window-to-change-payment': 'payment',

  // Processing steps
  'payment-approved': 'processing',
  'ready-for-handling': 'processing',
  'ready-for-packing': 'processing',
  'start-handling': 'processing',
  'authorize-fulfillment': 'processing',
  handling: 'processing',
  canceled: 'processing',
  'verifying-invoice': 'processing',
  canceling: 'processing',
  'request-cancel': 'processing',
  'on-order-completed': 'processing',
  'on-order-completed-ffm': 'processing',
  'cancellation-requested': 'processing',

  // Shipping steps
  'shipping-in-progress': 'shipping',
  'ready-for-invoicing': 'shipping',
  'ready-for-picking': 'shipping',
  shipped: 'shipping',
  invoice: 'processing',
  invoiced: 'processing',
} as const

const FAILED_STATUSES = [
  'denied',
  'request-cancel',
  'canceling',
  'canceled',
  'cancellation-requested',
  'payment-denied',
] as const

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

const StepIcon = ({ status }: { status: StepStatus }) => {
  if (status === 'completed') {
    return (
      <div data-fs-shipping-step-icon data-fs-shipping-step-completed>
        <UIIcon name="Checked" height={20} width={20} />
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div data-fs-shipping-step-icon data-fs-shipping-step-loading>
        <UIIcon name="DotsThree" height={20} width={20} />
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div data-fs-shipping-step-icon data-fs-shipping-step-failed>
        <UIIcon name="X" height={20} width={20} />
      </div>
    )
  }

  return <div data-fs-shipping-step-icon />
}

const getStepStatus = (
  stepKey: StepKey,
  currentStatus: ApiOrderStatus,
  isCanceled: boolean
): StepStatus => {
  if (isCanceled && stepKey === STATUS_MAPPING[currentStatus]) {
    return 'failed'
  }

  const currentStepIndex = VISUAL_STEPS.findIndex(
    (step) => step.key === STATUS_MAPPING[currentStatus]
  )

  const thisStepIndex = VISUAL_STEPS.findIndex((step) => step.key === stepKey)

  if (currentStepIndex === -1) {
    if (thisStepIndex === 0) {
      return 'loading'
    }

    return 'not-started'
  }

  if (thisStepIndex === currentStepIndex) {
    return 'loading'
  }

  return thisStepIndex < currentStepIndex ? 'completed' : 'not-started'
}

function MyAccountStatusCard({ status }: MyAccountStatusCardProps) {
  const isCanceled = FAILED_STATUSES.includes(
    status as (typeof FAILED_STATUSES)[number]
  )

  const steps: Step[] = VISUAL_STEPS.map((step) => {
    const stepStatus = getStepStatus(step.key, status, isCanceled)

    return {
      label: step.label(stepStatus),
      status: stepStatus,
    }
  })

  return (
    <MyAccountCard title="Status" data-fs-order-status-card>
      <div data-fs-order-status-content>
        {steps.map((step, index) => (
          <div
            key={`${step.label}-${index}`}
            data-fs-shipping-step
            data-fs-shipping-status={step.status}
          >
            <StepIcon status={step.status} />
            <div data-fs-shipping-step-content>
              <p data-fs-shipping-step-label>{step.label}</p>
              {step.completedAt && (
                <div data-fs-shipping-step-details>
                  <span data-fs-shipping-step-date>
                    {formatDate(step.completedAt)}
                  </span>
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                data-fs-shipping-connector
                data-fs-shipping-connector-status={
                  step.status === 'completed' ? 'completed' : 'not-started'
                }
              />
            )}
          </div>
        ))}
      </div>
    </MyAccountCard>
  )
}

export default MyAccountStatusCard
