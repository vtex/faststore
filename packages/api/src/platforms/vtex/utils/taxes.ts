export const withTax = (price: number, tax: number, unitMultiplier: number = 1) => {
    const unitTax = tax / unitMultiplier
  
    return Math.round((price + unitTax) * 100) / 100
  }