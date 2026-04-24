import {
  Alert as UIAlert,
  Button as UIButton,
  Icon as UIIcon,
  useUI,
} from '@faststore/ui'
import { useState } from 'react'
import MyAccountOrderActionModal from '../MyAccountOrderActionModal'
import { useOrderAuthorization } from 'src/sdk/account/useOrderAuthorization'
import type { ProcessOrderAuthorizationRule } from '@generated/graphql'

interface MyAccountBuyingPolicyAlertProps {
  ruleForAuthorization: ProcessOrderAuthorizationRule
  onAuthorizationComplete?: () => void
}

export const BUYING_POLICY_APPROVAL_REQUIRED_MESSAGE =
  'This buying policy requires your approval before the order can proceed.'

export default function MyAccountBuyingPolicyAlert({
  ruleForAuthorization,
  onAuthorizationComplete,
}: MyAccountBuyingPolicyAlertProps) {
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
            Reject
          </UIButton>
          <UIButton
            variant="primary"
            size="small"
            icon={<UIIcon name="CircleCheck" />}
            onClick={handleApprove}
            loading={loading}
            data-fs-buying-policy-action-approve
          >
            Approve
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

      <MyAccountOrderActionModal
        isOpen={isAuthorizationOpen}
        loading={loading}
        onClose={() => setIsAuthorizationOpen(false)}
        onConfirm={handleReject}
        title="Reject approval request"
        message={
          <>
            You're about to reject this approval request, triggered by the
            {` ${ruleForAuthorization.rule.name} policy`}. Rejecting any
            approval request will deny the entire order.
            <br />
            <br />
            This action is permanent and cannot be undone.
          </>
        }
        confirmText="Reject"
        danger
      />
    </>
  )
}
