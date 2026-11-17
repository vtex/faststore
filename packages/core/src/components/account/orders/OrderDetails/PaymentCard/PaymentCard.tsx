import Card from '../../../components/Card'
import PaymentFlagsIcon from './PaymentFlagsIcon'
import { Link } from '@faststore/ui'
import { useFormatPrice } from '../../../utils/useFormatPrice'
import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import {
  type OrderPaymentSectionLabels,
  resolveOrderPaymentLabels,
} from '../orderDetailsLabels'

export type OrderPaymentData = NonNullable<
  NonNullable<ServerOrderDetailsQueryQuery['userOrder']>['paymentData']
>
export type OrderPaymentDataTransaction = NonNullable<
  NonNullable<OrderPaymentData['transactions']>[number]
>
export type OrderPaymentDataTransactionPayment = NonNullable<
  NonNullable<OrderPaymentDataTransaction['payments']>[number]
>

interface PaymentCardProps {
  paymentData?: OrderPaymentData | null
  currencyCode: string
  allowCancellation?: boolean
  labels?: OrderPaymentSectionLabels
}

const getPaymentMethodInfo = (
  payment: OrderPaymentDataTransactionPayment,
  labels: Required<OrderPaymentSectionLabels>
) => {
  const baseInfo = {
    type: labels.billingLabel,
    methodName: '',
    icon: payment.paymentSystemName,
  }

  switch (payment.group) {
    case 'creditCard':
    case 'debitCard':
      return {
        ...baseInfo,
        methodName: `${payment.paymentSystemName} ${labels.endingInLabel} ${payment.lastDigits}`,
      }
    case 'bankInvoice':
      return {
        ...baseInfo,
        type: labels.bankInvoiceLabel,
        methodName: labels.bankInvoiceLabel,
      }
    case 'payPal':
      return {
        ...baseInfo,
        methodName: labels.paypalLabel,
      }
    case 'giftCard':
      return {
        ...baseInfo,
        type: labels.giftCardLabel,
        methodName: labels.giftCardLabel,
      }
    default:
      return {
        ...baseInfo,
        methodName: payment.paymentSystemName,
      }
  }
}

const getBankInvoiceUrl = (
  transactions: OrderPaymentData['transactions'] | undefined
) => {
  for (const transaction of transactions ?? []) {
    for (const payment of transaction?.payments ?? []) {
      if (payment?.url) {
        return payment.url.replace('{Installment}', '1')
      }
    }
  }

  return null
}

function PaymentCard({
  paymentData,
  currencyCode,
  allowCancellation = false,
  labels: labelsProp,
}: PaymentCardProps) {
  const labels = resolveOrderPaymentLabels(labelsProp)
  const formatPrice = useFormatPrice()

  const bankInvoiceUrl = getBankInvoiceUrl(paymentData?.transactions)

  const showPrintBankInvoiceButton = allowCancellation && bankInvoiceUrl

  return (
    <Card title={labels.paymentTitle} data-fs-order-payment-card>
      <div data-fs-payment-details>
        {paymentData?.transactions?.[0]?.payments?.map((payment) => {
          if (!payment) {
            return null
          }

          const methodInfo = getPaymentMethodInfo(payment, labels)
          // Check if redemptionCode exists on payment
          const hasRedemptionCode =
            payment.group === 'giftCard' && payment.redemptionCode

          return (
            <div key={payment.id} data-fs-payment-info>
              <div data-fs-payment-method>
                <div data-fs-payment-method-info>
                  <p data-fs-payment-name>{methodInfo.methodName}</p>
                  <PaymentFlagsIcon payment={payment} />
                </div>
                <div data-fs-payment-value>
                  {hasRedemptionCode ? (
                    <span>
                      {payment.redemptionCode} -{' '}
                      {formatPrice(payment.value ?? 0, currencyCode)}
                    </span>
                  ) : (payment.installments ?? 0) > 1 ? (
                    <span>
                      {labels.installmentCopy
                        .replace('{count}', String(payment.installments))
                        .replace(
                          '{value}',
                          formatPrice(
                            (payment.value ?? 0) / (payment.installments ?? 1),
                            currencyCode
                          )
                        )}
                    </span>
                  ) : (
                    <span>{formatPrice(payment.value ?? 0, currencyCode)}</span>
                  )}
                </div>
              </div>

              <div data-fs-payment-transaction-info>
                {payment.tid && (
                  <span data-fs-payment-tid>
                    {labels.tidLabel} {payment.tid}
                  </span>
                )}
                {payment.connectorResponses?.authId && (
                  <span data-fs-payment-authid>
                    {labels.authIdLabel}{' '}
                    {String(payment.connectorResponses.authId)}
                  </span>
                )}
                <div data-fs-payment-bank-invoice>
                  {payment.bankIssuedInvoiceIdentificationNumber && (
                    <span data-fs-payment-bank-invoice-number>
                      {labels.invoiceNumberLabel}{' '}
                      {payment.bankIssuedInvoiceIdentificationNumber}
                    </span>
                  )}
                  {showPrintBankInvoiceButton && (
                    <Link
                      data-fs-payment-invoice-link
                      href={bankInvoiceUrl}
                      target="_blank"
                    >
                      {labels.printBankInvoiceLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default PaymentCard
