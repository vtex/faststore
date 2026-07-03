import {
  Alert as UIAlert,
  Button as UIButton,
  Icon as UIIcon,
  useUI,
} from '@faststore/ui'
import { Fragment, type ReactNode, useState } from 'react'
import OrderActionModal from '../OrderActionModal'
import { useOrderAuthorization } from 'src/sdk/account/useOrderAuthorization'
import type { ProcessOrderAuthorizationRule } from '@generated/graphql'

interface BuyingPolicyAlertProps {
  ruleForAuthorization: ProcessOrderAuthorizationRule
  onAuthorizationComplete?: () => void
  labels?: {
    approveLabel?: string
    rejectLabel?: string
    rejectModalTitle?: string
    rejectModalMessage?: string
    rejectModalConfirmText?: string
  }
}

export const BUYING_POLICY_APPROVAL_REQUIRED_MESSAGE =
  'This buying policy requires your approval before the order can proceed.'

const DEFAULT_REJECT_MODAL_TITLE = 'Reject approval request'
const DEFAULT_REJECT_MODAL_MESSAGE =
  "You're about to reject this approval request, triggered by the {policy} policy. Rejecting any approval request will deny the entire order.\n\nThis action is permanent and cannot be undone."
const DEFAULT_REJECT_MODAL_CONFIRM_TEXT = 'Reject'

function renderRejectMessage(template: string, policyName: string): ReactNode {
  const lines = template.replace('{policy}', policyName).split('\n')

  return lines.map((line, index) => (
    <Fragment key={`${index}-${line}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ))
}

export default function BuyingPolicyAlert({
  ruleForAuthorization,
  onAuthorizationComplete,
  labels,
}: BuyingPolicyAlertProps) {
  const approveLabel = labels?.approveLabel ?? 'Approve'
  const rejectLabel = labels?.rejectLabel ?? 'Reject'
  const rejectModalTitle =
    labels?.rejectModalTitle ?? DEFAULT_REJECT_MODAL_TITLE
  const rejectModalMessage =
    labels?.rejectModalMessage ?? DEFAULT_REJECT_MODAL_MESSAGE
  const rejectModalConfirmText =
    labels?.rejectModalConfirmText ?? DEFAULT_REJECT_MODAL_CONFIRM_TEXT
  const { pushToast } = useUI()
  const [isAuthorizationOpen, setIsAuthorizationOpen] = useState<boolean>(false)
  const { data, error, processOrderAuthorization, loading } =
    useOrderAuthorization()

  const handleApprove = async () => {
    try {
      await processOrderAuthorization({
        data: {
          orderAuthorizationId: ruleForAuthorization.orderAuthorizationId,
          ruleId: ruleForAuthorization.rule.id,
          dimensionId: ruleForAuthorization.dimensionId,
          approved: true,
        },
      })

      // Success toast
      pushToast({
        status: 'INFO',
        message: `${ruleForAuthorization.rule.name} policy approved successfully.`,
        icon: <UIIcon width={30} height={30} name="CircleWavyCheck" />,
      })

      onAuthorizationComplete?.()
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message: "Policy couldn't be approved due to a technical issue.",
        icon: <UIIcon width={30} height={30} name="CircleWavyWarning" />,
      })
    }
  }

  const handleReject = async () => {
    try {
      await processOrderAuthorization({
        data: {
          orderAuthorizationId: ruleForAuthorization.orderAuthorizationId,
          ruleId: ruleForAuthorization.rule.id,
          dimensionId: ruleForAuthorization.dimensionId,
          approved: false,
        },
      })

      pushToast({
        status: 'INFO',
        message: `${ruleForAuthorization.rule.name} policy rejected successfully. Order denied.`,
        icon: <UIIcon width={30} height={30} name="XCircle" />,
      })

      setIsAuthorizationOpen(false)
      onAuthorizationComplete?.()
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message: "Policy couldn't be rejected due to a technical issue.",
        icon: <UIIcon width={30} height={30} name="CircleWavyWarning" />,
      })
    }
  }

  if (!ruleForAuthorization) {
    return null
  }

  return (
    <>
      <div data-fs-buying-policy-alert>
        <div data-fs-buying-policy-message>
          <h3 data-fs-buying-policy-title>{ruleForAuthorization.rule.name}</h3>
          <p data-fs-buying-policy-description>
            {ruleForAuthorization?.rule?.trigger?.condition?.description ??
              BUYING_POLICY_APPROVAL_REQUIRED_MESSAGE}
          </p>
        </div>

        <div data-fs-buying-policy-actions>
          <UIButton
            variant="secondary"
            size="small"
            icon={<UIIcon name="XCircle" />}
            onClick={() => setIsAuthorizationOpen(true)}
            disabled={loading}
            data-fs-buying-policy-action-reject
            data-fs-button-danger
          >
            {rejectLabel}
          </UIButton>
          <UIButton
            variant="primary"
            size="small"
            icon={<UIIcon name="CircleCheck" />}
            onClick={handleApprove}
            loading={loading}
            data-fs-buying-policy-action-approve
          >
            {approveLabel}
          </UIButton>
        </div>
      </div>

      {data?.isPendingForOtherAuthorizer && (
        <UIAlert
          data-fs-pending-policies-alert
          icon={<UIIcon name="Info" width={20} height={20} />}
        >
          Your approval is recorded. This order is still pending further
          approvals.
        </UIAlert>
      )}

      <OrderActionModal
        isOpen={isAuthorizationOpen}
        loading={loading}
        onClose={() => setIsAuthorizationOpen(false)}
        onConfirm={handleReject}
        title={rejectModalTitle}
        message={renderRejectMessage(
          rejectModalMessage,
          ruleForAuthorization.rule.name
        )}
        confirmText={rejectModalConfirmText}
        danger
      />
    </>
  )
}
