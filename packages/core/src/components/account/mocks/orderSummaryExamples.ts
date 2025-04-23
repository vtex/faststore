import {
  generateOrderSummary,
  type OrderSummary,
} from './orderSummaryGenerator'

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

// ------------------ REAL API RESPONSE EXAMPLES ------------------

// Example based on Google Pay from actual API response
export const realGooglePayOrderSummary: OrderSummary = {
  totals: [
    {
      id: 'Items',
      name: 'Items Total',
      value: 399,
    },
    {
      id: 'Discounts',
      name: 'Discounts Total',
      value: 0,
    },
    {
      id: 'Shipping',
      name: 'Shipping Total',
      value: 0,
    },
    {
      id: 'Tax',
      name: 'Tax Total',
      value: 0,
    },
  ],
  currencyCode: 'BRL',
  allowCancellation: false,
  paymentData: {
    giftCards: [],
    transactions: [
      {
        isActive: true,
        transactionId: '1C8572AE9DC24875BF8C855650FFB382',
        merchantName: 'RECORRENCIAQA',
        payments: [
          {
            id: '95DD8252DB434FDE96FA3C1A21AB8635',
            paymentSystem: '4',
            paymentSystemName: 'Mastercard',
            value: 399,
            installments: 1,
            referenceValue: 399,
            cardHolder: null,
            cardNumber: null,
            firstDigits: '550209',
            lastDigits: '0498',
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: null,
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: null,
            group: 'creditCard',
            tid: 'TID-C79D1392DA',
            dueDate: null,
            connectorResponses: {
              Tid: 'TID-C79D1392DA',
              ReturnCode: '2000',
              Message:
                'CallbackUR: https://gatewayqa.vtexpayments.com.br/api/pvt/payment-provider/transactions/1C8572AE9DC24875BF8C855650FFB382/payments/95DD8252DB434FDE96FA3C1A21AB8635/callback?accountName=recorrenciaqa&X-VTEX-signature=VVRqUzFhZ294RzQ1UTZPdlM2Nld0N1Bi',
              authId: 'AUT-230CE043E2',
              nsu: 'NSU-3BCCEEB9C6',
              acquirer: 'TestPay',
            },
            giftCardProvider: null,
            giftCardAsDiscount: null,
            koinUrl: null,
            accountId: 'F9A02A7FEA5343BC9D0EAC0644DE0349',
            parentAccountId: null,
            bankIssuedInvoiceIdentificationNumber: null,
            bankIssuedInvoiceIdentificationNumberFormatted: null,
            bankIssuedInvoiceBarCodeNumber: null,
            bankIssuedInvoiceBarCodeType: null,
            billingAddress: {
              postalCode: '59070400',
              city: 'Natal',
              state: 'RN',
              country: 'BR',
              street: 'Avenida Capitão Mor Gouveia',
              number: '',
              neighborhood: '',
              complement: '',
              reference: null,
              geoCoordinates: [],
            },
            paymentOrigin: 'Google Pay',
          },
        ],
      },
    ],
  },
  clientProfileData: {
    id: 'clientProfileData',
    email: 'contact@example.com',
    firstName: 'John',
    lastName: 'Doe',
    documentType: 'cpf',
    document: '12345678900',
    phone: '+5599999999999',
    corporateName: null,
    tradeName: null,
    corporateDocument: null,
    stateInscription: null,
    corporatePhone: null,
    isCorporate: false,
    userProfileId: '5a3692de-358a-4bea-8885-044bce33bb93',
    customerClass: null,
  },
}

// Example based on Gift Card payment from actual API response
export const realGiftCardOrderSummary: OrderSummary = {
  totals: [
    {
      id: 'Items',
      name: 'Items Total',
      value: 399,
    },
    {
      id: 'Discounts',
      name: 'Discounts Total',
      value: 0,
    },
    {
      id: 'Shipping',
      name: 'Shipping Total',
      value: 0,
    },
    {
      id: 'Tax',
      name: 'Tax Total',
      value: 0,
    },
  ],
  currencyCode: 'BRL',
  allowCancellation: false,
  paymentData: {
    giftCards: [
      {
        id: 'c254260d-fce6-468c-96c6-9d6b4b8f2fa7_151',
        redemptionCode: 'WGN*************YVJ',
        name: null,
        caption: null,
        value: 399,
        balance: 100000000,
        provider: 'VtexGiftCard',
        groupName: null,
        inUse: true,
        isSpecialCard: false,
      },
    ],
    transactions: [
      {
        isActive: true,
        transactionId: '59E0A1A67C174CBA93D85800D4B8BA28',
        merchantName: 'RECORRENCIAQA',
        payments: [
          {
            id: '9BDB2CA2BDBD4824BAB5FDA9AA02B9E0',
            paymentSystem: '16',
            paymentSystemName: 'Vale',
            value: 399,
            installments: 1,
            referenceValue: 399,
            cardHolder: null,
            cardNumber: null,
            firstDigits: null,
            lastDigits: null,
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: 'c254260d-fce6-468c-96c6-9d6b4b8f2fa7_151',
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: 'WGNG-VG**-****-EYVJ',
            group: 'giftCard',
            tid: '7418e5e9151e46f5be433b534bbab822',
            dueDate: null,
            connectorResponses: {},
            giftCardProvider: 'VtexGiftCard',
            giftCardAsDiscount: false,
            koinUrl: null,
            accountId: null,
            parentAccountId: null,
            bankIssuedInvoiceIdentificationNumber: null,
            bankIssuedInvoiceIdentificationNumberFormatted: null,
            bankIssuedInvoiceBarCodeNumber: null,
            bankIssuedInvoiceBarCodeType: null,
            billingAddress: null,
            paymentOrigin: null,
          },
        ],
      },
    ],
  },
  clientProfileData: {
    id: 'clientProfileData',
    email: 'contact@example.com',
    firstName: 'John',
    lastName: 'Doe',
    documentType: 'cpf',
    document: '12345678900',
    phone: '+5599999999999',
    corporateName: null,
    tradeName: null,
    corporateDocument: null,
    stateInscription: null,
    corporatePhone: null,
    isCorporate: false,
    userProfileId: '5a3692de-358a-4bea-8885-044bce33bb93',
    customerClass: null,
  },
}

// Example based on multiple payment methods (2 gift cards + 2 credit cards) from actual API response
export const realMultiplePaymentMethodsOrderSummary: OrderSummary = {
  totals: [
    {
      id: 'Items',
      name: 'Items Total',
      value: 399,
    },
    {
      id: 'Discounts',
      name: 'Discounts Total',
      value: 0,
    },
    {
      id: 'Shipping',
      name: 'Shipping Total',
      value: 0,
    },
    {
      id: 'Tax',
      name: 'Tax Total',
      value: 0,
    },
  ],
  currencyCode: 'BRL',
  allowCancellation: false,
  paymentData: {
    giftCards: [
      {
        id: 'c254260d-fce6-468c-96c6-9d6b4b8f2fa7_152',
        redemptionCode: 'YOP*************CVY',
        name: null,
        caption: null,
        value: 100,
        balance: 100,
        provider: 'VtexGiftCard',
        groupName: null,
        inUse: true,
        isSpecialCard: false,
      },
      {
        id: 'c254260d-fce6-468c-96c6-9d6b4b8f2fa7_151',
        redemptionCode: 'WGN*************YVJ',
        name: null,
        caption: null,
        value: 100,
        balance: 100,
        provider: 'VtexGiftCard',
        groupName: null,
        inUse: true,
        isSpecialCard: false,
      },
    ],
    transactions: [
      {
        isActive: true,
        transactionId: '4F0BD21C0ECD47B3B9261FE6EE6E1805',
        merchantName: 'RECORRENCIAQA',
        payments: [
          {
            id: '11D81D3B6BF84283A6E457DAA5FAE632',
            paymentSystem: '16',
            paymentSystemName: 'Vale',
            value: 100,
            installments: 1,
            referenceValue: 100,
            cardHolder: null,
            cardNumber: null,
            firstDigits: null,
            lastDigits: null,
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: 'c254260d-fce6-468c-96c6-9d6b4b8f2fa7_152',
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: 'YOPA-VN**-****-LCVY',
            group: 'giftCard',
            tid: 'f503284907e245bd9b1d3d2b646b6709',
            dueDate: null,
            connectorResponses: {},
            giftCardProvider: 'VtexGiftCard',
            giftCardAsDiscount: false,
            koinUrl: null,
            accountId: null,
            parentAccountId: null,
            bankIssuedInvoiceIdentificationNumber: null,
            bankIssuedInvoiceIdentificationNumberFormatted: null,
            bankIssuedInvoiceBarCodeNumber: null,
            bankIssuedInvoiceBarCodeType: null,
            billingAddress: null,
            paymentOrigin: null,
          },
          {
            id: '258A1F1648C042A5B960542D787661BE',
            paymentSystem: '2',
            paymentSystemName: 'Visa',
            value: 99,
            installments: 1,
            referenceValue: 99,
            cardHolder: null,
            cardNumber: null,
            firstDigits: '425481',
            lastDigits: '2321',
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: null,
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: null,
            group: 'creditCard',
            tid: '58738547',
            dueDate: null,
            connectorResponses: {
              Tid: '58738547',
              ReturnCode: null,
              Message: null,
              authId: '738547',
            },
            giftCardProvider: null,
            giftCardAsDiscount: null,
            koinUrl: null,
            accountId: 'C7F0C2F0C41D4F8D9130673604B6AFF6',
            parentAccountId: 'C7F0C2F0C41D4F8D9130673604B6AFF6',
            bankIssuedInvoiceIdentificationNumber: null,
            bankIssuedInvoiceIdentificationNumberFormatted: null,
            bankIssuedInvoiceBarCodeNumber: null,
            bankIssuedInvoiceBarCodeType: null,
            billingAddress: {
              postalCode: '59070-400',
              city: 'Natal',
              state: 'RN',
              country: 'BRA',
              street: 'Avenida Capitão-mor Gouveia',
              number: '2488',
              neighborhood: 'Cidade da Esperança',
              complement: null,
              reference: null,
              geoCoordinates: [-35.2359733581543, -5.820143699645996],
            },
            paymentOrigin: null,
          },
          {
            id: '92716B78104F4089B3A6C018D2B82F4B',
            paymentSystem: '4',
            paymentSystemName: 'Mastercard',
            value: 100,
            installments: 1,
            referenceValue: 100,
            cardHolder: null,
            cardNumber: null,
            firstDigits: '234065',
            lastDigits: '0155',
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: null,
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: null,
            group: 'creditCard',
            tid: 'TID-F1C296FC1C',
            dueDate: null,
            connectorResponses: {
              Tid: 'TID-F1C296FC1C',
              ReturnCode: '2000',
              Message:
                'CallbackUR: https://gatewayqa.vtexpayments.com.br/api/pvt/payment-provider/transactions/4F0BD21C0ECD47B3B9261FE6EE6E1805/payments/92716B78104F4089B3A6C018D2B82F4B/callback?accountName=recorrenciaqa&X-VTEX-signature=aTBJNUNJV2N0aE5Ha3ZhcGJZRU41RTFp',
              authId: 'AUT-DDC7811382',
              nsu: 'NSU-2A9B2CFD43',
              acquirer: 'TestPay',
            },
            giftCardProvider: null,
            giftCardAsDiscount: null,
            koinUrl: null,
            accountId: '77B6C1E93E394710B915D85CE2221ABC',
            parentAccountId: '77B6C1E93E394710B915D85CE2221ABC',
            bankIssuedInvoiceIdentificationNumber: null,
            bankIssuedInvoiceIdentificationNumberFormatted: null,
            bankIssuedInvoiceBarCodeNumber: null,
            bankIssuedInvoiceBarCodeType: null,
            billingAddress: {
              postalCode: '59070-400',
              city: 'Natal',
              state: 'RN',
              country: 'BRA',
              street: 'Avenida Capitão-mor Gouveia',
              number: '2488',
              neighborhood: 'Cidade da Esperança',
              complement: null,
              reference: null,
              geoCoordinates: [-35.2359733581543, -5.820143699645996],
            },
            paymentOrigin: null,
          },
          {
            id: 'F52354D2B2134AB59B6B198F1E3B6A97',
            paymentSystem: '16',
            paymentSystemName: 'Vale',
            value: 100,
            installments: 1,
            referenceValue: 100,
            cardHolder: null,
            cardNumber: null,
            firstDigits: null,
            lastDigits: null,
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: 'c254260d-fce6-468c-96c6-9d6b4b8f2fa7_151',
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: 'WGNG-VG**-****-EYVJ',
            group: 'giftCard',
            tid: 'bdeb3f7300e6484eb416c71445d6d311',
            dueDate: null,
            connectorResponses: {},
            giftCardProvider: 'VtexGiftCard',
            giftCardAsDiscount: false,
            koinUrl: null,
            accountId: null,
            parentAccountId: null,
            bankIssuedInvoiceIdentificationNumber: null,
            bankIssuedInvoiceIdentificationNumberFormatted: null,
            bankIssuedInvoiceBarCodeNumber: null,
            bankIssuedInvoiceBarCodeType: null,
            billingAddress: null,
            paymentOrigin: null,
          },
        ],
      },
    ],
  },
  clientProfileData: {
    id: 'clientProfileData',
    email: 'contact@example.com',
    firstName: 'John',
    lastName: 'Doe',
    documentType: 'cpf',
    document: '12345678900',
    phone: '+5599999999999',
    corporateName: null,
    tradeName: null,
    corporateDocument: null,
    stateInscription: null,
    corporatePhone: null,
    isCorporate: false,
    userProfileId: '5a3692de-358a-4bea-8885-044bce33bb93',
    customerClass: null,
  },
}
