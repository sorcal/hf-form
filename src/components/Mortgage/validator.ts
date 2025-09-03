export const MIN_PROPERTY_PRICE = 10000

export function validatePurchasePriceAndGetError(purchasePrice: number | null) {
  if (purchasePrice === null) {
    return 'Purchase price is required.'
  }

  // cannot tell what's the best max value here
  if (purchasePrice < MIN_PROPERTY_PRICE) {
    return `Purchase price must be at least ${MIN_PROPERTY_PRICE}.`
  }

  return ''
}

export function validateTotalSavingsAndGetError(
  totalSavings: number | null,
  purchasePrice: number | null,
) {
  if (totalSavings === null) {
    return 'Total savings is required.'
  }

  if (totalSavings <= 0) {
    return 'Total savings must be greater than zero.'
  }

  /**
   * TODO should be a better condition for comparison of savings and price
   * e.g. it doesn't make sense to get a mortgage if purchasePrice=50000 and savings=49999
   */
  if (purchasePrice && purchasePrice <= totalSavings) {
    return 'Total savings must be less than purchase price.'
  }

  return ''
}

export function validateRepayRateAndGetError(rate: number | null) {
  if (rate === null) {
    return 'Annual repayment rate is required.'
  }

  if (rate <= 0 || rate >= 100) {
    return 'Annual repayment rate must be between 0 and 100.'
  }

  return ''
}
