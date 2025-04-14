import MyAccountCard from '../../../components/MyAccountCard'
import type {
  MyAccountTransaction,
  MyAccountPayment,
} from '../../../mocks/orderSummaryGenerator'
import MyAccountPaymentFlagsIcon from './MyAccountPaymentFlagsIcon'

// Extend the MyAccountPayment type to include missing properties
interface ExtendedMyAccountPayment extends MyAccountPayment {
  date?: string
  giftCard?: {
    name: string
    redemptionCode?: string
  }
}

interface MyAccountPaymentCardProps {
  paymentData?: {
    transactions: MyAccountTransaction[]
  }
  currencyCode: string
}

// Format date to the desired format
const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(date))
}

function MyAccountPaymentCard({
  paymentData,
  currencyCode,
}: MyAccountPaymentCardProps) {
  // Format price values according to the specified currency (converts cents to standard units)
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(value / 100)
  }

  // Get payment method display info
  const getPaymentMethodInfo = (payment: ExtendedMyAccountPayment) => {
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
          const methodInfo = getPaymentMethodInfo(
            payment as ExtendedMyAccountPayment
          )

          return (
            <div key={payment.id} data-fs-payment-info>
              <div data-fs-payment-method>
                <div>
                  <p data-fs-payment-name>{methodInfo.methodName}</p>
                  <div data-fs-payment-value>
                    {payment.installments > 1 ? (
                      <span>
                        {payment.installments}x of{' '}
                        {formatPrice(payment.value / payment.installments)}
                      </span>
                    ) : (
                      <span>{formatPrice(payment.value)}</span>
                    )}
                  </div>
                </div>
                <MyAccountPaymentFlagsIcon payment={payment} />
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
                {(payment as ExtendedMyAccountPayment).giftCard
                  ?.redemptionCode && (
                  <span data-fs-payment-gift-code>
                    Redemption Code:{' '}
                    {
                      (payment as ExtendedMyAccountPayment).giftCard
                        ?.redemptionCode
                    }
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
