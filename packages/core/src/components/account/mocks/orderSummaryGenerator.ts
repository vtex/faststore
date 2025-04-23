export interface MyAccountPayment {
  paymentSystemName: string
  id: string
  paymentSystem: string
  giftCardId?: string | null
  giftCardName?: string | null
  giftCardCaption?: string | null
  redemptionCode?: string | null
  giftCardProvider?: string | null
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
  connectorResponses?: Record<string, unknown> | null
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

export interface ClientProfileData {
  id: string
  email: string
  firstName: string
  lastName: string
  documentType: string
  document: string
  phone: string
  corporateName: string | null
  tradeName: string | null
  corporateDocument: string | null
  stateInscription: string | null
  corporatePhone: string | null
  isCorporate: boolean
  userProfileId: string
  customerClass: string | null
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
  cash?: boolean
  nubank?: boolean
  promissory?: boolean
  applePay?: boolean
  googlePay?: boolean
  multipleCards?: {
    cards: Array<{
      brand: CardBrand
      installments: number
      cardHolder: string
      lastDigits: string
      firstDigits: string
      value: number
    }>
  }
}

interface GenerateOrderSummaryParams {
  currencyCode?: 'USD' | 'BRL' | 'EUR'
  itemsTotal?: number
  shipping?: number
  discounts?: number
  tax?: number
  change?: number
  payments?: PaymentMethodConfig
  allowCancellation?: boolean
}

export interface OrderSummary {
  totals: MyAccountTotal[]
  currencyCode: string
  paymentData: {
    giftCards: any[]
    transactions: MyAccountTransaction[]
  }
  allowCancellation: boolean
  clientProfileData: ClientProfileData
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

const defaultClientProfileData: ClientProfileData = {
  id: 'clientProfileData',
  email: 'contact@stellarcorp.com',
  firstName: 'John',
  lastName: 'Smith',
  documentType: 'cnpj',
  document: '12345678000199',
  phone: '+1 (555) 123-4567',
  corporateName: 'Stellar Corp',
  tradeName: 'Stellar',
  corporateDocument: '12345678000199',
  stateInscription: null,
  corporatePhone: '+1 (555) 123-4567',
  isCorporate: true,
  userProfileId: '5a3692de-358a-4bea-8885-044bce33bb93',
  customerClass: null,
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
    allowCancellation = false,
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
      // giftCard: {
      //   name: 'Holiday Special Gift Card',
      //   id: 'GC' + Math.random().toString(36).substring(7).toUpperCase(),
      //   caption: 'Holiday Special',
      //   redemptionCode: '****-****-****-MGOG',
      //   provider: 'Store Gift Card',
      // },
      giftCardId: 'GC' + Math.random().toString(36).substring(7).toUpperCase(),
      giftCardName: null,
      giftCardCaption: null,
      redemptionCode: 'WGNG-VG**-****-EYVJ',
      giftCardProvider: 'Store Gift Card',
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
      url: 'https://recorrenciaqa.vtexpayments.com.br:443/BankIssuedInvoice/Transaction/abcd1234efgh5678/Payment/ijkl9012mnop3456/Installment/{Installment}',
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

  if (payments.cash) {
    paymentsList.push({
      ...defaultPayment,
      id: 'cash-' + Math.random().toString(36).substring(7),
      paymentSystem: '47',
      paymentSystemName: 'Cash',
      group: 'cash',
      value: totalAmount,
      referenceValue: totalAmount,
    })
  }

  if (payments.nubank) {
    paymentsList.push({
      ...defaultPayment,
      id: 'nu-' + Math.random().toString(36).substring(7),
      paymentSystem: '178',
      paymentSystemName: 'Nubank',
      group: 'Nubank',
      value: totalAmount,
      referenceValue: totalAmount,
      connectorResponses: {
        tid: null,
        returnCode: null,
        message: '[401] Unauthorized Undefined auth appKey header',
      },
    })
  }

  if (payments.promissory) {
    paymentsList.push({
      ...defaultPayment,
      id: 'prom-' + Math.random().toString(36).substring(7),
      paymentSystem: '201',
      paymentSystemName: 'Depósito Banco do Brasil',
      group: 'promissory',
      value: totalAmount,
      referenceValue: totalAmount,
    })
  }

  if (payments.multipleCards?.cards?.length) {
    payments.multipleCards.cards.forEach((card, index) => {
      paymentsList.push({
        ...defaultPayment,
        id: `mcc-${index}-` + Math.random().toString(36).substring(7),
        paymentSystem: card.brand === 'visa' ? '2' : '4', // Simple mapping for visa/mastercard
        paymentSystemName:
          card.brand.charAt(0).toUpperCase() + card.brand.slice(1),
        group: 'creditCard',
        value: card.value,
        referenceValue: card.value,
        lastDigits: card.lastDigits,
        cardHolder: card.cardHolder,
        firstDigits: card.firstDigits,
        installments: card.installments,
        connectorResponses: {
          authId: `AUT-${Math.random().toString(36).substring(7).toUpperCase()}`,
          tid: `TID-${Math.random().toString(36).substring(7).toUpperCase()}`,
          returnCode: '2000',
          message: 'Transaction successful',
        },
      })
    })
  }

  if (payments.applePay) {
    paymentsList.push({
      ...defaultPayment,
      id: 'ap-' + Math.random().toString(36).substring(7),
      paymentSystem: 'applePay',
      paymentSystemName: 'ApplePay',
      group: 'applePay',
      value: totalAmount,
      referenceValue: totalAmount,
      tid: 'AP-' + Math.random().toString(36).substring(7).toUpperCase(),
      connectorResponses: {
        authId:
          'APPLE-' + Math.random().toString(36).substring(7).toUpperCase(),
        tid: 'TID-' + Math.random().toString(36).substring(7).toUpperCase(),
        returnCode: '0000',
        message: 'Apple Pay transaction approved',
      },
    })
  }

  if (payments.googlePay) {
    paymentsList.push({
      ...defaultPayment,
      id: 'gp-' + Math.random().toString(36).substring(7),
      paymentSystem: 'googlePay',
      paymentSystemName: 'GooglePay',
      group: 'googlePay',
      value: totalAmount,
      referenceValue: totalAmount,
      tid: 'GP-' + Math.random().toString(36).substring(7).toUpperCase(),
      connectorResponses: {
        authId:
          'GOOGLE-' + Math.random().toString(36).substring(7).toUpperCase(),
        tid: 'TID-' + Math.random().toString(36).substring(7).toUpperCase(),
        returnCode: '0000',
        message: 'Google Pay transaction approved',
      },
    })
  }

  return {
    totals,
    currencyCode,
    allowCancellation,
    clientProfileData: defaultClientProfileData,
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
