export const withTax = (price: number, tax = 0, unitMultiplier = 1) => {
  const unitTax = tax / unitMultiplier

  return Math.round((price + unitTax) * 100) / 100
}
