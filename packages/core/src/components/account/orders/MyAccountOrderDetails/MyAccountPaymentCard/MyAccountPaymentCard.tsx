import { useSession } from 'src/sdk/session'
import MyAccountCard from '../../../components/MyAccountCard'
import type {
  MyAccountTransaction,
  MyAccountPayment,
} from '../../../mocks/orderSummaryGenerator'
import MyAccountPaymentFlagsIcon from './MyAccountPaymentFlagsIcon'
import { useCallback } from 'react'

interface MyAccountPaymentCardProps {
  paymentData?: {
    transactions: MyAccountTransaction[]
  }
  currencyCode: string
}

function MyAccountPaymentCard({
  paymentData,
  currencyCode,
}: MyAccountPaymentCardProps) {
  const { locale } = useSession()

  const formatPrice = useCallback(
    (value: number, currencyCode: string) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
      }).format(value / 100)
    },
    [locale]
  )

  const getPaymentMethodInfo = (payment: MyAccountPayment) => {
    const baseInfo = {
      type: 'Billing',
      methodName: '',
      icon: payment.paymentSystemName,
    }

    switch (payment.group) {
      case 'creditCard':
      case 'debitCard':
        return {
          ...baseInfo,
          methodName: `${payment.paymentSystemName} ending in ${payment.lastDigits}`,
        }
      case 'bankInvoice':
        return {
          ...baseInfo,
          type: 'Bank Invoice',
          methodName: 'Bank Invoice',
        }
      case 'payPal':
        return {
          ...baseInfo,
          methodName: 'PayPal',
        }
      case 'giftCard':
        return {
          ...baseInfo,
          type: 'Gift Card',
          methodName: payment.giftCard?.name ?? 'Gift Card',
        }
      default:
        return {
          ...baseInfo,
          methodName: payment.paymentSystemName,
        }
    }
  }

  return (
    <MyAccountCard title="Payment" data-fs-order-payment-card>
      <div data-fs-payment-details>
        {paymentData?.transactions[0]?.payments.map((payment) => {
          const methodInfo = getPaymentMethodInfo(payment)

          return (
            <div key={payment.id} data-fs-payment-info>
              <div data-fs-payment-method>
                <div>
                  <p data-fs-payment-name>{methodInfo.methodName}</p>
                  <MyAccountPaymentFlagsIcon payment={payment} />
                </div>
                <div data-fs-payment-value>
                  {payment.group === 'giftCard' &&
                  payment.giftCard?.redemptionCode ? (
                    <span>
                      {/* TODO: Check if this value its received already with a hidden text or we need to implement it */}
                      {payment.giftCard?.redemptionCode} -{' '}
                      {formatPrice(payment.value, currencyCode)}
                    </span>
                  ) : payment.installments > 1 ? (
                    <span>
                      {payment.installments}x of{' '}
                      {formatPrice(
                        payment.value / payment.installments,
                        currencyCode
                      )}
                    </span>
                  ) : (
                    <span>{formatPrice(payment.value, currencyCode)}</span>
                  )}
                </div>
              </div>

              <div data-fs-payment-transaction-info>
                {payment.connectorResponses?.tid && (
                  <span data-fs-payment-tid>
                    Tid: {payment.connectorResponses.tid}
                  </span>
                )}
                {payment.connectorResponses?.authId && (
                  <span data-fs-payment-authid>
                    AuthId: {payment.connectorResponses.authId}
                  </span>
                )}
                {payment.bankIssuedInvoiceIdentificationNumber && (
                  <span data-fs-payment-bank-invoice>
                    Invoice Number:{' '}
                    {payment.bankIssuedInvoiceIdentificationNumber}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </MyAccountCard>
  )
}

export default MyAccountPaymentCard
