export const usdOrderSummary = {
  totals: [
    { id: 'Items', name: 'Subtotal', value: 29709 },
    { id: 'Discounts', name: 'Discounts', value: 0 },
    { id: 'Shipping', name: 'Shipping', value: 500 },
    { id: 'Tax', name: 'Taxes', value: 0 },
  ],
  currencyCode: 'USD',
  paymentData: {
    giftCards: [] as any[],
    transactions: [
      {
        isActive: true,
        transactionId: '3E196F679C954CF2BDB6C3B49EAA8E45',
        merchantName: 'STOREFRAMEWORK',
        payments: [
          {
            id: '9B07676E275E45B3B03853EFB4B8119C',
            paymentSystem: '201',
            paymentSystemName: 'Free',
            value: 30209,
            installments: 1,
            referenceValue: 30209,
            group: 'promissory',
          },
        ],
      },
    ],
  },
}

export const brlOrderSummaryWithChange = {
  totals: [
    { id: 'Items', name: 'Total dos Itens', value: 3290 },
    { id: 'Discounts', name: 'Total dos Descontos', value: 0 },
    { id: 'Shipping', name: 'Total do Frete', value: 1160 },
    { id: 'Tax', name: 'Total da Taxa', value: 0 },
    { id: 'Change', name: 'Total das mudanças', value: -3290 },
  ],
  currencyCode: 'BRL',
  paymentData: {
    giftCards: [] as any[],
    transactions: [
      {
        isActive: true,
        transactionId: '418213DE29634837A63DD693A937A696',
        merchantName: 'luxstore',
        payments: [
          {
            id: 'D3DEECAB3C6C4B9EAF8EF4C1FE062FF3',
            paymentSystem: '6',
            paymentSystemName: 'Boleto Bancário',
            value: 4450,
            installments: 1,
            referenceValue: 4450,
            group: 'bankInvoice',
          },
        ],
      },
    ],
  },
}
