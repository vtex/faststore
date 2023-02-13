import {
  Visa,
  Diners,
  Mastercard,
  EloCard,
  PayPal,
  Stripe,
  GooglePay,
  ApplePay,
} from '@faststore/components'

const FooterFlags = [
  { image: <Visa />, text: 'Visa' },
  { image: <Diners />, text: 'Diners Club' },
  { image: <Mastercard />, text: 'Mastercard' },
  { image: <EloCard />, text: 'Elo Card' },
  { image: <PayPal />, text: 'PayPal' },
  { image: <Stripe />, text: 'Stripe' },
  { image: <GooglePay />, text: 'GooglePay' },
  { image: <ApplePay />, text: 'ApplePay' },
]

export default FooterFlags
