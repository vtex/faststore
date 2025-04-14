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
  bankinvoice: 'Cash',
  paypal: 'PayPal',
  giftcard: 'Gift',
  cash: 'Cash',
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

    return (
      PAYMENT_FLAGS[slug as keyof typeof PAYMENT_FLAGS] ?? PAYMENT_FLAGS.cash
    )
  }

  if (!shouldShowFlag(payment)) {
    return null
  }

  return (
    <div data-fs-payment-flag>
      <UIIcon name={getPaymentFlag()} height={22} />
    </div>
  )
}

export default MyAccountPaymentFlagsIcon
