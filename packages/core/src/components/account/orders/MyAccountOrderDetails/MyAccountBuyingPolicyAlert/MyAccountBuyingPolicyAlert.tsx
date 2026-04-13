import {
  Alert as UIAlert,
  Button as UIButton,
  Icon as UIIcon,
  useUI,
} from '@faststore/ui'
import { useState } from 'react'
import { useIntl } from 'react-intl'
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
  const intl = useIntl()
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

      pushToast({
        status: 'INFO',
        message: intl.formatMessage(
          { id: 'myaccount.orderDetails.buyingPolicy.approvedSuccess' },
          { ruleName: ruleForAuthorization.rule.name }
        ),
        icon: <UIIcon width={30} height={30} name="CircleWavyCheck" />,
      })

      onAuthorizationComplete?.()
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message: intl.formatMessage({
          id: 'myaccount.orderDetails.buyingPolicy.approvalError',
        }),
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
        message: intl.formatMessage(
          { id: 'myaccount.orderDetails.buyingPolicy.rejectedSuccess' },
          { ruleName: ruleForAuthorization.rule.name }
        ),
        icon: <UIIcon width={30} height={30} name="XCircle" />,
      })

      setIsAuthorizationOpen(false)
      onAuthorizationComplete?.()
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message: intl.formatMessage({
          id: 'myaccount.orderDetails.buyingPolicy.rejectionError',
        }),
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
              intl.formatMessage({
                id: 'myaccount.orderDetails.buyingPolicy.requiresApproval',
              })}
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
            {intl.formatMessage({
              id: 'myaccount.orderDetails.buyingPolicy.reject',
            })}
          </UIButton>
          <UIButton
            variant="primary"
            size="small"
            icon={<UIIcon name="CircleCheck" />}
            onClick={handleApprove}
            loading={loading}
            data-fs-buying-policy-action-approve
          >
            {intl.formatMessage({
              id: 'myaccount.orderDetails.buyingPolicy.approve',
            })}
          </UIButton>
        </div>
      </div>

      {data?.isPendingForOtherAuthorizer && (
        <UIAlert
          data-fs-pending-policies-alert
          icon={<UIIcon name="Info" width={20} height={20} />}
        >
          {intl.formatMessage({
            id: 'myaccount.orderDetails.buyingPolicy.pendingPolicies',
          })}
        </UIAlert>
      )}

      <MyAccountOrderActionModal
        isOpen={isAuthorizationOpen}
        loading={loading}
        onClose={() => setIsAuthorizationOpen(false)}
        onConfirm={handleReject}
        title={intl.formatMessage({
          id: 'myaccount.orderDetails.buyingPolicy.rejectTitle',
        })}
        message={
          <>
            {intl.formatMessage(
              { id: 'myaccount.orderDetails.buyingPolicy.rejectMessage' },
              { ruleName: ruleForAuthorization.rule.name }
            )}
            <br />
            <br />
            {intl.formatMessage({
              id: 'myaccount.orderDetails.buyingPolicy.permanent',
            })}
          </>
        }
        confirmText={intl.formatMessage({
          id: 'myaccount.orderDetails.buyingPolicy.reject',
        })}
        danger
      />
    </>
  )
}
