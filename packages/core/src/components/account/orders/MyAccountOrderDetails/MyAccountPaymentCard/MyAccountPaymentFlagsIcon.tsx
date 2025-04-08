import type { MyAccountPayment } from '../../../mocks/orderDetails'
import paymentFlags from '../../../../../images/payment-flags.png'

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
  visa: { x: 0, y: 0 },
  mastercard: { x: -40, y: 0 },
  diners: { x: -80, y: 0 },
  american: { x: -120, y: 0 },
  hipercard: { x: -160, y: 0 },
  discover: { x: -200, y: 0 },
  banricompras: { x: -240, y: 0 },
  aura: { x: -280, y: 0 },
  elo: { x: -320, y: 0 },
  jcb: { x: -360, y: 0 },
  bankinvoice: { x: -400, y: 0 },
  paypal: { x: -440, y: 0 },
  giftcard: { x: -480, y: 0 },
  cash: { x: -520, y: 0 },
} as const

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

  const flag = getPaymentFlag()

  if (!payment.paymentSystemName) {
    return null
  }

  return (
    <div
      data-fs-payment-flag
      style={{
        width: '40px',
        height: paymentFlags.height,
        backgroundImage: `url(${paymentFlags.src})`,
        backgroundPosition: `${flag.x}px ${flag.y}px`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

export default MyAccountPaymentFlagsIcon
