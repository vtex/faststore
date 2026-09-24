import { Icon as UIIcon, Skeleton as UISkeleton } from '@faststore/ui'
import { useRouter } from 'next/router'
import { useRef, type ReactNode } from 'react'
import Card from 'src/components/account/components/Card'
import {
  orderStatusMap,
  type OrderStatusCmsLabels,
  type OrderStatusKey,
} from 'src/utils/userOrderStatus'
import { useConnectorPositioning } from './useConnectorPositioning'
import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import {
  type OrderStatusSectionLabels,
  resolveOrderStatusLabels,
} from '../orderDetailsLabels'
import {
  formatDate,
  getDisplayStepLabel,
  type StepKey,
  type StepStatus,
} from './statusCardLocalization'

interface Step {
  label: ReactNode
  status: StepStatus
  completedAt?: string
}

interface StatusCardProps {
  status: OrderStatusKey
  creationDate: ServerOrderDetailsQueryQuery['userOrder']['creationDate']
  labels?: OrderStatusSectionLabels
  statusLabels?: OrderStatusCmsLabels
}

// Define the visual progression of order steps from start to finish
const VISUAL_STEPS = [
  {
    key: 'order',
  },
  {
    key: 'approval',
  },
  {
    key: 'payment',
  },
  {
    key: 'processing',
  },
  {
    key: 'shipping',
  },
] as const

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

function StatusCard({
  status,
  creationDate,
  labels: labelsProp,
  statusLabels,
}: Readonly<StatusCardProps>) {
  const labels = resolveOrderStatusLabels(labelsProp)
  const { locale = 'en-US' } = useRouter()
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

    const stepLabel = getDisplayStepLabel({
      stepKey: step.key,
      stepStatus,
      labels,
      status,
      statusLabels,
      isCanceled,
    })

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
    <Card title={labels.statusTitle} data-fs-order-status-card>
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
                    {formatDate(step.completedAt, locale).date}
                  </span>
                  <span data-fs-shipping-step-time>
                    {formatDate(step.completedAt, locale).time}
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
    </Card>
  )
}

export default StatusCard
