import type { MyAccountPayment } from 'src/components/account/mocks/orderSummaryGenerator'
import { Icon as UIIcon } from '@faststore/ui'

interface PaymentFlagsIconProps {
  payment: Pick<MyAccountPayment, 'group' | 'paymentSystemName'>
}

const PAYMENT_GROUPS = {
  BANK_INVOICE: 'bankInvoice',
  PAYPAL: 'payPal',
  GIFT_CARD: 'giftCard',
  DEBIT_CARD: 'debitCard',
} as const

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
  // TODO: I could not check this with api. We need to check if the flag key is correct
  applepay: 'ApplePay',
  googlepay: 'GooglePay',
} as const

function shouldShowFlag(payment: Pick<MyAccountPayment, 'paymentSystemName'>) {
  if (!payment.paymentSystemName || payment.paymentSystemName === 'Free') {
    return false
  }

  return true
}

function MyAccountPaymentFlagsIcon({ payment }: PaymentFlagsIconProps) {
  const getPaymentFlag = () => {
    const { group, paymentSystemName } = payment
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
