import { Icon as UIIcon } from '@faststore/ui'
import React from 'react'
import MyAccountCard from 'src/components/account/components/MyAccountCard'

export type StepStatus = 'completed' | 'current' | 'pending' | 'canceled'
export type StepKey =
  | 'order'
  | 'approval'
  | 'payment'
  | 'processing'
  | 'delivery'
  | 'shipping'
export type ApiStatus = keyof typeof STATUS_MAPPING

interface Step {
  label: string
  status: StepStatus
  completedAt?: string
}

interface MyAccountStatusCardProps {
  status: ApiStatus
}

const VISUAL_STEPS = [
  { label: 'Order placed', key: 'order' as const },
  { label: 'Pending approval', key: 'approval' as const },
  { label: 'Payment authorization', key: 'payment' as const },
  { label: 'Handling order', key: 'processing' as const },
  { label: 'Deliver to carrier', key: 'delivery' as const },
  { label: 'Ship order', key: 'shipping' as const },
] as const

const STATUS_MAPPING = {
  // Order steps
  'order-created': 'order',
  'order-accepted': 'order',

  // Payment steps
  'payment-pending': 'payment',
  'payment-approved': 'payment',
  'payment-denied': 'payment',
  'window-to-change-payment': 'payment',

  // Processing steps
  'ready-for-handling': 'processing',
  'start-handling': 'processing',
  'authorize-fulfillment': 'processing',
  handling: 'processing',

  // Delivery steps
  'ready-for-invoicing': 'delivery',
  'verifying-invoice': 'delivery',
  invoiced: 'delivery',

  // Cancellation steps
  'request-cancel': 'canceled',
  canceling: 'canceled',
  canceled: 'canceled',
  'cancellation-requested': 'canceled',
} as const

const CANCELLATION_STATUSES = [
  'request-cancel',
  'canceling',
  'canceled',
  'cancellation-requested',
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

  if (status === 'current') {
    return (
      <div data-fs-shipping-step-icon data-fs-shipping-step-current>
        <UIIcon name="DotsThree" height={20} width={20} />
      </div>
    )
  }

  if (status === 'canceled') {
    return (
      <div data-fs-shipping-step-icon data-fs-shipping-step-canceled>
        <UIIcon name="XCircle" height={20} width={20} />
      </div>
    )
  }

  return <div data-fs-shipping-step-icon />
}

const getStepStatus = (
  stepKey: StepKey,
  currentStatus: ApiStatus,
  isCanceled: boolean
): StepStatus => {
  if (isCanceled) {
    return stepKey === STATUS_MAPPING[currentStatus] ? 'canceled' : 'pending'
  }

  const currentStepIndex = VISUAL_STEPS.findIndex(
    (step) => step.key === STATUS_MAPPING[currentStatus]
  )
  const thisStepIndex = VISUAL_STEPS.findIndex((step) => step.key === stepKey)

  if (currentStepIndex === -1) {
    return 'pending'
  }

  if (thisStepIndex === currentStepIndex) {
    return 'current'
  }

  return thisStepIndex < currentStepIndex ? 'completed' : 'pending'
}

function MyAccountStatusCard({ status }: MyAccountStatusCardProps) {
  const isCanceled = CANCELLATION_STATUSES.includes(
    status as (typeof CANCELLATION_STATUSES)[number]
  )

  const steps: Step[] = VISUAL_STEPS.map((step) => ({
    label: step.label,
    status: getStepStatus(step.key, status, isCanceled),
  }))

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
                  step.status === 'completed' ? 'completed' : 'pending'
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
