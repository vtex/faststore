import {
  Alert as UIAlert,
  Button as UIButton,
  Icon as UIIcon,
  useUI,
} from '@faststore/ui'
import { useState } from 'react'
import type { CommercialAuthorizationRule } from './useCommercialAuthorizationMock'
import MyAccountOrderActionModal from '../MyAccountOrderActionModal'
import { useOrderAuthorization } from 'src/sdk/account/useOrderAuthorization'

interface MyAccountBuyingPolicyAlertProps {
  rule: CommercialAuthorizationRule & {
    orderAuthorizationId: string
    dimensionId: string
  }
}

export default function MyAccountBuyingPolicyAlert({
  rule,
}: MyAccountBuyingPolicyAlertProps) {
  const { pushToast } = useUI()
  const [isAuthorizationOpen, setIsAuthorizationOpen] = useState<boolean>(false)
  const { data, error, processOrderAuthorization, loading } =
    useOrderAuthorization()

  const handleApprove = async () => {
    try {
      await processOrderAuthorization({
        data: {
          orderAuthorizationId: rule.orderAuthorizationId,
          ruleId: rule.ruleId,
          dimensionId: rule.dimensionId,
          approved: true,
        },
      })

      // Success toast
      pushToast({
        status: 'INFO',
        message: `${'NOME DA POLICY'} policy approved successfully.`,
        icon: <UIIcon width={30} height={30} name="CircleWavyCheck" />,
      })

      setIsAuthorizationOpen(false)
      // TODO: Invalidate order cache or refetch order details
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message:
          "Policy couldn't be approved due to a technical issue. Try again.",
        icon: <UIIcon width={30} height={30} name="CircleWavyWarning" />,
      })
    }
  }

  const handleReject = async () => {
    try {
      await processOrderAuthorization({
        data: {
          orderAuthorizationId: rule.orderAuthorizationId,
          ruleId: rule.ruleId,
          dimensionId: rule.dimensionId,
          approved: false,
        },
      })

      pushToast({
        status: 'INFO',
        message: `${'NOME DA POLICY'} policy rejected successfully. Order denied.`,
        icon: <UIIcon width={30} height={30} name="XCircle" />,
      })

      setIsAuthorizationOpen(false)
      // TODO: Invalidate order cache or refetch order details
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message:
          "Policy couldn't be rejected due to a technical issue. Try again.",
        icon: <UIIcon width={30} height={30} name="CircleWavyWarning" />,
      })
    }
  }

  if (!rule && !data.data.isPendingForOtherAuthorizer) {
    return null
  }

  return (
    <>
      <div data-fs-buying-policy-alert>
        <div data-fs-buying-policy-message>
          <h3 data-fs-buying-policy-title>TITLE</h3>
          <p data-fs-buying-policy-description>
            This buying policy requires your approval before the order can
            proceed.
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

      {data?.data.isPendingForOtherAuthorizer && (
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
            {' <Standard Spending Limit policy>'}. Rejecting any approval
            request will deny the entire order.
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
