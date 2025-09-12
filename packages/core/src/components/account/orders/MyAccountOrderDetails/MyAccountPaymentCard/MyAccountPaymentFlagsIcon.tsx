import { Icon as UIIcon } from '@vtex/faststore-ui'
import type { OrderPaymentDataTransactionPayment } from './MyAccountPaymentCard'

interface PaymentFlagsIconProps {
  payment: Pick<
    OrderPaymentDataTransactionPayment,
    'group' | 'paymentSystemName' | 'paymentOrigin'
  >
}

const PAYMENT_GROUPS = {
  BANK_INVOICE: 'bankInvoice',
  PAYPAL: 'payPal',
  GIFT_CARD: 'giftCard',
  DEBIT_CARD: 'debitCard',
} as const

// Map for icons names
const PAYMENT_FLAGS = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  diners: 'Diners',
  american: 'Amex',
  hipercard: 'Hipercard',
  discover: 'Discover',
  banricompras: 'Banricompras',
  aura: 'Aura',
  elo: 'EloCard',
  jcb: 'JCB',
  bankinvoice: 'FileText',
  paypal: 'PayPal',
  giftcard: 'Gift',
  cash: 'Currency',
  applepay: 'ApplePay',
  googlepay: 'GooglePay',
} as const

function shouldShowFlag(
  payment: Pick<OrderPaymentDataTransactionPayment, 'paymentSystemName'>
) {
  if (!payment.paymentSystemName || payment.paymentSystemName === 'Free') {
    return false
  }

  return true
}

function MyAccountPaymentFlagsIcon({ payment }: PaymentFlagsIconProps) {
  const getPaymentFlag = () => {
    const { group, paymentSystemName, paymentOrigin } = payment

    // Handle Google Pay and Apple Pay based on paymentOrigin
    if (paymentOrigin) {
      if (paymentOrigin === 'Google Pay') {
        return PAYMENT_FLAGS.googlepay
      }
      if (paymentOrigin === 'Apple Pay') {
        return PAYMENT_FLAGS.applepay
      }
    }

    let slug: string

    switch (group) {
      case PAYMENT_GROUPS.BANK_INVOICE:
        slug = 'bankinvoice'
        break
      case PAYMENT_GROUPS.PAYPAL:
        slug = 'paypal'
        break
      case PAYMENT_GROUPS.GIFT_CARD:
        slug = 'giftcard'
        break
      case PAYMENT_GROUPS.DEBIT_CARD:
        slug = 'cash'
        break
      default:
        slug = paymentSystemName.toLowerCase().split(' ')[0]
        break
    }

    if (!(slug in PAYMENT_FLAGS)) {
      return null
    }

    return PAYMENT_FLAGS[slug as keyof typeof PAYMENT_FLAGS]
  }

  if (!shouldShowFlag(payment)) {
    return null
  }

  const flagName = getPaymentFlag()

  if (!flagName) {
    return null
  }

  return (
    <div data-fs-payment-flag>
      <UIIcon name={flagName} height={22} />
    </div>
  )
}

export default MyAccountPaymentFlagsIcon
