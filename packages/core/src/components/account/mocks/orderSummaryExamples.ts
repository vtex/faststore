import { generateOrderSummary } from './orderSummaryGenerator'

export const usdOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 29709,
  shipping: 500,
  discounts: 0,
  tax: 0,
  payments: {
    free: true,
  },
})

export const brlOrderSummaryWithChange = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 3290,
  shipping: 1160,
  discounts: 0,
  tax: 0,
  change: 3290,
  payments: {
    bankInvoice: true,
  },
  allowCancellation: true,
})

// Example with Debit Card Payment (Mastercard)
export const debitCardOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 7500,
  shipping: 0,
  tax: 0,
  payments: {
    debitCard: {
      enabled: true,
      brand: 'mastercard',
      cardHolder: 'Jane Doe',
      lastDigits: '8765',
      firstDigits: '511111',
      expireMonth: '08',
      expireYear: '2024',
    },
  },
})

// Example with Bank Invoice Payment
export const bankInvoiceOrderSummary = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 12000,
  shipping: 0,
  tax: 0,
  payments: {
    bankInvoice: true,
  },
  allowCancellation: true,
})

// Example with PayPal Payment
export const paypalOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 5000,
  shipping: 0,
  tax: 0,
  payments: {
    paypal: true,
  },
})

// Example with Gift Card Payment
export const giftCardOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 10000,
  shipping: 0,
  tax: 0,
  payments: {
    giftCard: true,
  },
})

// Example with Free Payment
export const freeOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 0,
  shipping: 0,
  tax: 0,
  payments: {
    free: true,
  },
})

// Example with Multiple Payment Methods (Credit Card + Gift Card)
export const multiplePaymentsOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 25000,
  shipping: 1000,
  tax: 500,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'visa',
      installments: 3,
      cardHolder: 'John Smith',
      lastDigits: '4321',
    },
    giftCard: true,
  },
})

// Example with Diners Club Payment
export const visaOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 18000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'visa',
      installments: 2,
      cardHolder: 'Alice Brown',
      lastDigits: '3456',
      firstDigits: '300123',
      expireMonth: '03',
      expireYear: '2026',
    },
  },
})

// Example with Diners Club Payment
export const mastercardOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 18000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'mastercard',
      installments: 2,
      cardHolder: 'Alice Brown',
      lastDigits: '3456',
      firstDigits: '300123',
      expireMonth: '03',
      expireYear: '2026',
    },
  },
})

// Example with Diners Club Payment
export const dinersOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 18000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'diners',
      installments: 2,
      cardHolder: 'Alice Brown',
      lastDigits: '3456',
      firstDigits: '300123',
      expireMonth: '03',
      expireYear: '2026',
    },
  },
})

// Example with American Express Payment
export const amexOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 22000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'american',
      installments: 1,
      cardHolder: 'Robert Wilson',
      lastDigits: '9012',
      firstDigits: '371234',
      expireMonth: '07',
      expireYear: '2025',
    },
  },
})

// Example with Hipercard Payment
export const hipercardOrderSummary = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 15000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'hipercard',
      installments: 4,
      cardHolder: 'Maria Silva',
      lastDigits: '7890',
      firstDigits: '606123',
      expireMonth: '09',
      expireYear: '2024',
    },
  },
})

// Example with Discover Payment
export const discoverOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 13000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'discover',
      installments: 1,
      cardHolder: 'David Lee',
      lastDigits: '1234',
      firstDigits: '601123',
      expireMonth: '11',
      expireYear: '2025',
    },
  },
})

// Example with Banricompras Payment
export const banricomprasOrderSummary = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 8000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'banricompras',
      installments: 3,
      cardHolder: 'Pedro Santos',
      lastDigits: '5678',
      firstDigits: '628123',
      expireMonth: '04',
      expireYear: '2026',
    },
  },
})

// Example with Aura Payment
export const auraOrderSummary = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 9500,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'aura',
      installments: 2,
      cardHolder: 'Ana Oliveira',
      lastDigits: '4321',
      firstDigits: '507123',
      expireMonth: '06',
      expireYear: '2024',
    },
  },
})

// Example with Elo Payment
export const eloOrderSummary = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 11000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'elo',
      installments: 5,
      cardHolder: 'Carlos Ferreira',
      lastDigits: '9876',
      firstDigits: '509123',
      expireMonth: '08',
      expireYear: '2025',
    },
  },
})

// Example with JCB Payment
export const jcbOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 16000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'jcb',
      installments: 1,
      cardHolder: 'Sarah Johnson',
      lastDigits: '2468',
      firstDigits: '352123',
      expireMonth: '10',
      expireYear: '2026',
    },
  },
})

// Example with Cash Payment
export const cashOrderSummary = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 399,
  shipping: 0,
  tax: 0,
  payments: {
    cash: true,
  },
})

// Example with Multiple Credit Cards Payment (Split Payment)
export const multipleCardsOrderSummary = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 535,
  shipping: 0,
  tax: 0,
  payments: {
    multipleCards: {
      cards: [
        {
          brand: 'visa',
          installments: 1,
          cardHolder: 'John Doe',
          lastDigits: '2321',
          firstDigits: '425481',
          value: 267,
        },
        {
          brand: 'mastercard',
          installments: 2,
          cardHolder: 'John Doe',
          lastDigits: '0155',
          firstDigits: '234065',
          value: 268,
        },
      ],
    },
  },
})

// Example with Nubank Payment
export const nubankOrderSummary = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 8800,
  shipping: 0,
  tax: 0,
  payments: {
    nubank: true,
  },
})

// Example with Promissory Payment (Bank Deposit)
export const promissoryOrderSummary = generateOrderSummary({
  currencyCode: 'BRL',
  itemsTotal: 11010,
  shipping: 0,
  tax: 0,
  payments: {
    promissory: true,
  },
})

// Example with Apple Pay Payment
export const applePayOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 9999,
  shipping: 0,
  tax: 0,
  payments: {
    applePay: true,
  },
})

// Example with Google Pay Payment
export const googlePayOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 8888,
  shipping: 0,
  tax: 0,
  payments: {
    googlePay: true,
  },
})
