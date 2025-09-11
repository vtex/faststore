import { Icon as UIIcon, Skeleton as UISkeleton } from '@vtex/faststore-ui'
import { useRef, type ReactNode } from 'react'
import MyAccountCard from '../../../components/MyAccountCard'
import {
  orderStatusMap,
  type OrderStatusKey,
} from '../../../../../utils/userOrderStatus'
import { useConnectorPositioning } from './useConnectorPositioning'
import type { ServerOrderDetailsQueryQuery } from '../../../../../../@generated/graphql'

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

// Define custom labels for each step based on their status
// This allows us to show different text for the same step depending on its current state
const STEP_LABELS: Record<StepKey, Record<StepStatus, string>> = {
  order: {
    completed: 'Order Placed',
    loading: 'Order Placed',
    'not-started': 'Order Placed',
    failed: 'Order Placed',
  },
  approval: {
    completed: 'Approved', // Custom
    loading: 'Approval Pending', // Use from orderStatusMap
    'not-started': 'Approval Pending',
    failed: 'Denied', // Custom
  },
  payment: {
    completed: 'Payment Approved', // Use from orderStatusMap
    loading: 'Payment Pending', // Use from orderStatusMap
    'not-started': 'Payment authorization', // Custom
    failed: 'Payment Denied', // Use from orderStatusMap
  },
  processing: {
    completed: 'Ready for Delivery', // Use from orderStatusMap
    loading: 'Handling order', // Custom
    'not-started': 'Handling order', // Custom
    failed: 'Canceled', // Use from orderStatusMap
  },
  shipping: {
    completed: 'Invoiced', // Use from orderStatusMap
    loading: 'Shipping order', // Custom
    'not-started': 'Ship order', // Custom
    failed: 'Canceled', // Use from orderStatusMap
  },
}

// Define the visual progression of order steps from start to finish
const VISUAL_STEPS = [
  {
    label: (stepStatus: StepStatus) => STEP_LABELS.order[stepStatus],
    key: 'order',
  },
  {
    label: (stepStatus: StepStatus) => STEP_LABELS.approval[stepStatus],
    key: 'approval',
  },
  {
    label: (stepStatus: StepStatus) => STEP_LABELS.payment[stepStatus],
    key: 'payment',
  },
  {
    label: (stepStatus: StepStatus) => STEP_LABELS.processing[stepStatus],
    key: 'processing',
  },
  {
    label: (stepStatus: StepStatus) => STEP_LABELS.shipping[stepStatus],
    key: 'shipping',
  },
] as const

// Map labels from userOrderStatus.ts to step keys
const LABEL_TO_STEP_MAPPING: Record<string, StepKey> = {
  'Order Placed': 'order',
  'Approval Pending': 'approval',
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
      : step.label(stepStatus)

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
    <MyAccountCard title="Status" data-fs-order-status-card>
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
