const BROKER_TAX = 0.0714
const CITY_TAX = 0.06

export function calculateImpliedLoan(
  propertyPrice: number,
  totalSavings: number,
  realEstateCommission: boolean,
) {
  const notaryCosts = 2144.0 + 0.013 * (propertyPrice - 100000.0)

  let brokerCosts = 0
  if (realEstateCommission) {
    brokerCosts = BROKER_TAX * propertyPrice
  }

  const stampDutyCosts = CITY_TAX * propertyPrice

  const totalCosts = notaryCosts + brokerCosts + stampDutyCosts

  return totalCosts - totalSavings + propertyPrice
}

export function calculateLoanToValue(impliedLoan: number, propertyPrice: number) {
  return (impliedLoan / propertyPrice) * 100
}
