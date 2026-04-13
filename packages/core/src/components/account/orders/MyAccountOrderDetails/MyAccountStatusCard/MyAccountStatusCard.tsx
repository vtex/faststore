import { Icon as UIIcon, Skeleton as UISkeleton } from '@faststore/ui'
import { useRef, type ReactNode } from 'react'
import { useIntl } from 'react-intl'
import MyAccountCard from 'src/components/account/components/MyAccountCard'
import { orderStatusMap, type OrderStatusKey } from 'src/utils/userOrderStatus'
import { useConnectorPositioning } from './useConnectorPositioning'
import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'

export type StepStatus = 'completed' | 'loading' | 'not-started' | 'failed'
export type StepKey =
  | 'order'
  | 'approval'
  | 'payment'
  | 'processing'
  | 'shipping'

interface Step {
  label: ReactNode
  status: StepStatus
  completedAt?: string
}

interface MyAccountStatusCardProps {
  status: OrderStatusKey
  creationDate: ServerOrderDetailsQueryQuery['userOrder']['creationDate']
}

// Message IDs for each step based on their status
const STEP_LABEL_IDS: Record<StepKey, Record<StepStatus, string>> = {
  order: {
    completed: 'myaccount.orderDetails.status.orderPlaced',
    loading: 'myaccount.orderDetails.status.orderPlaced',
    'not-started': 'myaccount.orderDetails.status.orderPlaced',
    failed: 'myaccount.orderDetails.status.orderPlaced',
  },
  approval: {
    completed: 'myaccount.orderDetails.status.approved',
    loading: 'myaccount.orderDetails.status.pendingApproval',
    'not-started': 'myaccount.orderDetails.status.pendingApproval',
    failed: 'myaccount.orderDetails.status.denied',
  },
  payment: {
    completed: 'myaccount.orderDetails.status.paymentApproved',
    loading: 'myaccount.orderDetails.status.paymentPending',
    'not-started': 'myaccount.orderDetails.status.paymentAuthorization',
    failed: 'myaccount.orderDetails.status.paymentDenied',
  },
  processing: {
    completed: 'myaccount.orderDetails.status.readyForDelivery',
    loading: 'myaccount.orderDetails.status.handlingOrder',
    'not-started': 'myaccount.orderDetails.status.handlingOrder',
    failed: 'myaccount.orderDetails.status.canceled',
  },
  shipping: {
    completed: 'myaccount.orderDetails.status.invoiced',
    loading: 'myaccount.orderDetails.status.shippingOrder',
    'not-started': 'myaccount.orderDetails.status.shipOrder',
    failed: 'myaccount.orderDetails.status.canceled',
  },
}

// Define the visual progression of order steps from start to finish
const VISUAL_STEPS: Array<{ key: StepKey }> = [
  { key: 'order' },
  { key: 'approval' },
  { key: 'payment' },
  { key: 'processing' },
  { key: 'shipping' },
]

// Map labels from userOrderStatus.ts to step keys
const LABEL_TO_STEP_MAPPING: Record<string, StepKey> = {
  'Order Placed': 'order',
  'Pending approval': 'approval',
  'Payment Pending': 'payment',
  'Payment Approved': 'processing',
  'Payment Denied': 'payment',
  'Ready for Delivery': 'processing',
  Invoiced: 'shipping',
}

// Define which order status labels indicate a canceled state
const CANCELED_LABELS = ['Cancellation Requested', 'Canceled']

// Define which order status labels indicate a failed state
const FAILED_LABELS = ['Payment Denied']

const formatDate = (date: string) => {
  const dateObj = new Date(date)

  const dateString = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(dateObj)

  const timeString = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj)

  return { date: dateString, time: timeString }
}

const StepIcon = ({
  status,
  isCanceled,
}: { status: StepStatus; isCanceled: boolean }) => {
  if (status === 'failed') {
    return (
      <div data-fs-shipping-step-icon data-fs-shipping-step-failed>
        <UIIcon name="X" height={16} width={16} />
      </div>
    )
  }

  if (isCanceled) {
    return <div data-fs-shipping-step-icon data-fs-shipping-step-canceled />
  }

  if (status === 'completed') {
    return (
      <div data-fs-shipping-step-icon data-fs-shipping-step-completed>
        <UIIcon name="Checked" height={16} width={16} />
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div data-fs-shipping-step-icon data-fs-shipping-step-loading>
        <UIIcon name="DotsThree" height={16} width={16} />
      </div>
    )
  }

  return <div data-fs-shipping-step-icon />
}

// Determine the visual status (completed, loading, not-started, or failed) of a specific step based on the current order status
const getStepStatus = ({
  stepKey,
  currentStatus,
  isCanceled,
  isFailed,
}: {
  stepKey: StepKey
  currentStatus: OrderStatusKey
  isCanceled: boolean
  isFailed: boolean
}): StepStatus => {
  // Get the label for the current status from userOrderStatus.ts
  const currentStatusLabel = orderStatusMap[currentStatus]?.label

  // If order is canceled, handle it specially
  if (isCanceled) {
    // For canceled orders, only the middle step (payment) will be marked as failed and the rest as not-started
    if (stepKey === 'payment') {
      return 'failed'
    }

    return 'not-started'
  }

  // Get the step key for the current status
  const currentStepKey = currentStatusLabel
    ? LABEL_TO_STEP_MAPPING[currentStatusLabel]
    : undefined

  if (isFailed && stepKey === currentStepKey) {
    return 'failed'
  }

  const currentStepIndex = VISUAL_STEPS.findIndex(
    (step) => step.key === currentStepKey
  )

  const thisStepIndex = VISUAL_STEPS.findIndex((step) => step.key === stepKey)

  // If we couldn't find the current step in our mapping
  if (currentStepIndex === -1) {
    // If this is the first step, it should be loading (order is in progress)
    if (thisStepIndex === 0) {
      return 'loading'
    }

    // All other steps haven't started yet
    return 'not-started'
  }

  // If this is the current step, show it as loading/in progress
  if (thisStepIndex === currentStepIndex) {
    return 'loading'
  }
  // Steps before the current step are completed, steps after are not started
  return thisStepIndex < currentStepIndex ? 'completed' : 'not-started'
}

function MyAccountStatusCard({
  status,
  creationDate,
}: MyAccountStatusCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const intl = useIntl()

  useConnectorPositioning(containerRef)

  // Get the label for the current status and check if it's a failed status
  const currentStatusLabel = orderStatusMap[status]?.label
  const isCanceled = currentStatusLabel
    ? CANCELED_LABELS.includes(currentStatusLabel)
    : false
  const isFailed = currentStatusLabel
    ? FAILED_LABELS.includes(currentStatusLabel)
    : false

  const steps: Step[] = VISUAL_STEPS.map((step) => {
    const stepStatus = getStepStatus({
      stepKey: step.key,
      currentStatus: status,
      isCanceled,
      isFailed,
    })

    const stepLabel = isCanceled
      ? step.key === 'payment'
        ? currentStatusLabel
        : '—' // prevent hydration mismatch
      : intl.formatMessage({ id: STEP_LABEL_IDS[step.key][stepStatus] })

    // Add creation date to the order step when it's completed or failed
    let completedAt: string | undefined
    if (
      step.key === 'order' &&
      (stepStatus === 'completed' || stepStatus === 'failed') &&
      creationDate
    ) {
      completedAt = creationDate
    }

    return {
      label: stepLabel,
      status: stepStatus,
      completedAt,
    }
  })

  return (
    <MyAccountCard
      title={intl.formatMessage({ id: 'myaccount.orderDetails.status.title' })}
      data-fs-order-status-card
    >
      <div data-fs-order-status-content ref={containerRef}>
        {steps.map((step, index) => (
          <div
            key={`step-${index}`}
            data-fs-shipping-step
            data-fs-shipping-status={step.status}
          >
            <StepIcon status={step.status} isCanceled={isCanceled} />
            <div data-fs-shipping-step-content>
              {step.label === '—' ? (
                <UISkeleton
                  key={`skeleton-${index}`}
                  size={{ width: '100px', height: '14px' }}
                  shimmer={false}
                />
              ) : (
                <p data-fs-shipping-step-label>{step.label}</p>
              )}
              {step.completedAt && (
                <div data-fs-shipping-step-details>
                  <span data-fs-shipping-step-date>
                    {formatDate(step.completedAt).date}
                  </span>
                  <span data-fs-shipping-step-time>
                    {formatDate(step.completedAt).time}
                  </span>
                </div>
              )}
            </div>
            <div
              data-fs-shipping-connector
              data-fs-shipping-connector-status={
                step.status === 'completed' ? 'completed' : 'not-started'
              }
            />
          </div>
        ))}
      </div>
    </MyAccountCard>
  )
}

export default MyAccountStatusCard
