export interface MyAccountPayment {
  paymentSystemName: string
  id: string
  paymentSystem: string
  giftCard?: {
    id: string
    name: string
    redemptionCode: string
    caption: string
    provider: string
  } | null
  group: string
  lastDigits?: string
  value: number
  referenceValue: number
  installments: number
  cardHolder?: string | null
  cardNumber?: string | null
  firstDigits?: string | null
  cvv2?: string | null
  expireMonth?: string | null
  expireYear?: string | null
  url?: string | null
  tid?: string | null
  dueDate?: string | null
  connectorResponses?: {
    tid?: string
    returnCode?: string
    message?: string
    authId?: string
  } | null
  giftCardAsDiscount?: boolean | null
  koinUrl?: string | null
  accountId?: string | null
  parentAccountId?: string | null
  bankIssuedInvoiceIdentificationNumber?: string | null
  bankIssuedInvoiceIdentificationNumberFormatted?: string | null
  bankIssuedInvoiceBarCodeNumber?: string | null
  bankIssuedInvoiceBarCodeType?: string | null
  billingAddress?: unknown | null
  paymentOrigin?: string | null
}

export interface MyAccountTransaction {
  isActive: boolean
  transactionId: string
  merchantName: string
  payments: MyAccountPayment[]
}

export interface MyAccountTotal {
  id: string
  name: string
  value: number
}

type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'diners'
  | 'american'
  | 'hipercard'
  | 'discover'
  | 'banricompras'
  | 'aura'
  | 'elo'
  | 'jcb'

interface PaymentMethodConfig {
  free?: boolean
  creditCard?: {
    enabled: boolean
    brand?: CardBrand
    installments?: number
    cardHolder?: string
    lastDigits?: string
    firstDigits?: string
    expireMonth?: string
    expireYear?: string
  }
  debitCard?: {
    enabled: boolean
    brand?: CardBrand
    cardHolder?: string
    lastDigits?: string
    firstDigits?: string
    expireMonth?: string
    expireYear?: string
  }
  paypal?: boolean
  giftCard?: boolean
  bankInvoice?: boolean
}

interface GenerateOrderSummaryParams {
  currencyCode?: 'USD' | 'BRL' | 'EUR'
  itemsTotal?: number
  shipping?: number
  discounts?: number
  tax?: number
  change?: number
  payments?: PaymentMethodConfig
}

interface OrderSummary {
  totals: MyAccountTotal[]
  currencyCode: string
  paymentData: {
    giftCards: any[]
    transactions: MyAccountTransaction[]
  }
}

const defaultPayment: MyAccountPayment = {
  paymentSystemName: '',
  id: '',
  paymentSystem: '',
  group: '',
  value: 0,
  referenceValue: 0,
  installments: 1,
  paymentOrigin: 'Online',
}

export function generateOrderSummary(
  params: GenerateOrderSummaryParams = {}
): OrderSummary {
  const {
    currencyCode = 'USD',
    itemsTotal = 29709,
    shipping = 500,
    discounts = 0,
    tax = 0,
    change = 0,
    payments = { free: true },
  } = params

  const totalAmount = itemsTotal + shipping - discounts + tax - change

  const totals: MyAccountTotal[] = [
    {
      id: 'Items',
      name: currencyCode === 'BRL' ? 'Total dos Itens' : 'Items Total',
      value: itemsTotal,
    },
    {
      id: 'Discounts',
      name: currencyCode === 'BRL' ? 'Total dos Descontos' : 'Discounts Total',
      value: discounts,
    },
    {
      id: 'Shipping',
      name: currencyCode === 'BRL' ? 'Total do Frete' : 'Shipping Total',
      value: shipping,
    },
    {
      id: 'Tax',
      name: currencyCode === 'BRL' ? 'Total da Taxa' : 'Tax Total',
      value: tax,
    },
  ]

  if (change > 0) {
    totals.push({
      id: 'Change',
      name: currencyCode === 'BRL' ? 'Total das mudanças' : 'Change Total',
      value: -change,
    })
  }

  const paymentsList: MyAccountPayment[] = []

  if (payments.free) {
    paymentsList.push({
      ...defaultPayment,
      id: 'free-' + Math.random().toString(36).substring(7),
      paymentSystem: '201',
      paymentSystemName: 'Free',
      group: 'promissory',
      value: totalAmount,
      referenceValue: totalAmount,
    })
  }

  if (payments.creditCard?.enabled) {
    const {
      brand = 'visa',
      installments = 3,
      cardHolder = 'John Smith',
      lastDigits = '4321',
      firstDigits = '411111',
      expireMonth = '12',
      expireYear = '2025',
    } = payments.creditCard

    paymentsList.push({
      ...defaultPayment,
      id: 'cc-' + Math.random().toString(36).substring(7),
      paymentSystem: 'creditCard',
      paymentSystemName: brand.charAt(0).toUpperCase() + brand.slice(1),
      group: 'creditCard',
      value: totalAmount,
      referenceValue: totalAmount,
      lastDigits,
      cardHolder,
      firstDigits,
      expireMonth,
      expireYear,
      installments,
      connectorResponses: {
        authId: '123456',
        tid: '123456',
        returnCode: '000',
        message: 'Transaction successful',
      },
    })
  }

  if (payments.paypal) {
    paymentsList.push({
      ...defaultPayment,
      id: 'pp-' + Math.random().toString(36).substring(7),
      paymentSystem: 'payPal',
      paymentSystemName: 'PayPal',
      group: 'payPal',
      value: totalAmount,
      referenceValue: totalAmount,
      tid: 'PP-' + Math.random().toString(36).substring(7).toUpperCase(),
      connectorResponses: {
        authId: 'PAY-NHBRV',
      },
    })
  }

  if (payments.giftCard) {
    paymentsList.push({
      ...defaultPayment,
      id: 'gc-' + Math.random().toString(36).substring(7),
      paymentSystem: 'giftCard',
      paymentSystemName: 'Gift Card',
      group: 'giftCard',
      value: totalAmount,
      referenceValue: totalAmount,
      giftCard: {
        name: 'Holiday Special Gift Card',
        id: 'GC' + Math.random().toString(36).substring(7).toUpperCase(),
        caption: 'Holiday Special',
        redemptionCode: '****-****-****-MGOG',
        provider: 'Store Gift Card',
      },
      giftCardAsDiscount: false,
    })
  }

  if (payments.bankInvoice) {
    paymentsList.push({
      ...defaultPayment,
      id: 'bi-' + Math.random().toString(36).substring(7),
      paymentSystem: 'bankInvoice',
      paymentSystemName: 'Bank Invoice',
      group: 'bankInvoice',
      value: totalAmount,
      referenceValue: totalAmount,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 15 days from now
      bankIssuedInvoiceIdentificationNumber:
        '34191.79001 01043.510047 91020.150008 4 84410026000',
      bankIssuedInvoiceIdentificationNumberFormatted:
        '34191.79001 01043.510047 91020.150008 4 84410026000',
      bankIssuedInvoiceBarCodeNumber:
        '34194844100260001791790010104351004791020150008',
      bankIssuedInvoiceBarCodeType: 'INT25',
    })
  }

  if (payments.debitCard?.enabled) {
    const {
      brand = 'mastercard',
      cardHolder = 'Jane Doe',
      lastDigits = '8765',
      firstDigits = '511111',
      expireMonth = '08',
      expireYear = '2024',
    } = payments.debitCard

    paymentsList.push({
      ...defaultPayment,
      id: 'dc-' + Math.random().toString(36).substring(7),
      paymentSystem: 'debitCard',
      paymentSystemName: brand.charAt(0).toUpperCase() + brand.slice(1),
      group: 'debitCard',
      value: totalAmount,
      referenceValue: totalAmount,
      lastDigits,
      cardHolder,
      firstDigits,
      expireMonth,
      expireYear,
      connectorResponses: {
        authId: '987654',
        tid: '123456',
        returnCode: '000',
        message: 'Transaction successful',
      },
    })
  }

  return {
    totals,
    currencyCode,
    paymentData: {
      giftCards: [],
      transactions: [
        {
          isActive: true,
          transactionId: Math.random().toString(36).substring(7).toUpperCase(),
          merchantName: 'STOREFRAMEWORK',
          payments: paymentsList,
        },
      ],
    },
  }
}
