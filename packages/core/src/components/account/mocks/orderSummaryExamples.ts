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
})

// Example with Credit Card Payment (Visa)
export const creditCardOrderSummary = generateOrderSummary({
  currencyCode: 'USD',
  itemsTotal: 15000,
  shipping: 0,
  tax: 0,
  payments: {
    creditCard: {
      enabled: true,
      brand: 'visa',
      installments: 3,
      cardHolder: 'John Smith',
      lastDigits: '4321',
      firstDigits: '411111',
      expireMonth: '12',
      expireYear: '2025',
    },
  },
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
