import { describe, it, expect } from 'vitest'
import {
  validatePurchasePriceAndGetError,
  validateTotalSavingsAndGetError,
  validateRepayRateAndGetError,
  MIN_PROPERTY_PRICE,
} from '@/components/Mortgage/validator'

describe('validatePurchasePriceAndGetError', () => {
  it('returns error when purchase price is null', () => {
    const result = validatePurchasePriceAndGetError(null)
    expect(result).toBe('Purchase price is required.')
  })

  it('returns error when purchase price is below minimum', () => {
    const result = validatePurchasePriceAndGetError(5000)
    expect(result).toBe('Purchase price must be at least 10000.')
  })

  it('returns error when purchase price equals minimum minus one', () => {
    const result = validatePurchasePriceAndGetError(MIN_PROPERTY_PRICE - 1)
    expect(result).toBe('Purchase price must be at least 10000.')
  })

  it('returns empty string when purchase price equals minimum', () => {
    const result = validatePurchasePriceAndGetError(MIN_PROPERTY_PRICE)
    expect(result).toBe('')
  })

  it('returns empty string when purchase price is above minimum', () => {
    const result = validatePurchasePriceAndGetError(50000)
    expect(result).toBe('')
  })

  it('returns empty string for large purchase price', () => {
    const result = validatePurchasePriceAndGetError(1000000)
    expect(result).toBe('')
  })
})

describe('validateTotalSavingsAndGetError', () => {
  it('returns error when total savings is null', () => {
    const result = validateTotalSavingsAndGetError(null, 50000)
    expect(result).toBe('Total savings is required.')
  })

  it('returns error when total savings is zero', () => {
    const result = validateTotalSavingsAndGetError(0, 50000)
    expect(result).toBe('Total savings must be greater than zero.')
  })

  it('returns error when total savings is negative', () => {
    const result = validateTotalSavingsAndGetError(-1000, 50000)
    expect(result).toBe('Total savings must be greater than zero.')
  })

  it('returns error when total savings equals purchase price', () => {
    const result = validateTotalSavingsAndGetError(50000, 50000)
    expect(result).toBe('Total savings must be less than purchase price.')
  })

  it('returns error when total savings is greater than purchase price', () => {
    const result = validateTotalSavingsAndGetError(60000, 50000)
    expect(result).toBe('Total savings must be less than purchase price.')
  })

  it('returns empty string when total savings is valid and less than purchase price', () => {
    const result = validateTotalSavingsAndGetError(30000, 50000)
    expect(result).toBe('')
  })

  it('returns empty string when purchase price is null but savings is positive', () => {
    const result = validateTotalSavingsAndGetError(30000, null)
    expect(result).toBe('')
  })

  it('returns empty string when total savings is just above zero', () => {
    const result = validateTotalSavingsAndGetError(0.01, 50000)
    expect(result).toBe('')
  })

  it('handles edge case where savings is one less than purchase price', () => {
    const result = validateTotalSavingsAndGetError(49999, 50000)
    expect(result).toBe('')
  })
})

describe('validateRepayRateAndGetError', () => {
  it('returns error when rate is null', () => {
    const result = validateRepayRateAndGetError(null)
    expect(result).toBe('Annual repayment rate is required.')
  })

  it('returns error when rate is zero', () => {
    const result = validateRepayRateAndGetError(0)
    expect(result).toBe('Annual repayment rate must be between 0 and 100.')
  })

  it('returns error when rate is negative', () => {
    const result = validateRepayRateAndGetError(-5)
    expect(result).toBe('Annual repayment rate must be between 0 and 100.')
  })

  it('returns error when rate is 100', () => {
    const result = validateRepayRateAndGetError(100)
    expect(result).toBe('Annual repayment rate must be between 0 and 100.')
  })

  it('returns error when rate is greater than 100', () => {
    const result = validateRepayRateAndGetError(150)
    expect(result).toBe('Annual repayment rate must be between 0 and 100.')
  })

  it('returns empty string when rate is valid (between 0 and 100)', () => {
    const result = validateRepayRateAndGetError(5.5)
    expect(result).toBe('')
  })

  it('returns empty string for rate just above zero', () => {
    const result = validateRepayRateAndGetError(0.01)
    expect(result).toBe('')
  })

  it('returns empty string for rate just below 100', () => {
    const result = validateRepayRateAndGetError(99.99)
    expect(result).toBe('')
  })

  it('returns empty string for typical mortgage rate', () => {
    const result = validateRepayRateAndGetError(3.25)
    expect(result).toBe('')
  })
})
