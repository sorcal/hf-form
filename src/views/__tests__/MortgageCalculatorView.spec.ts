import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import MortgageCalculatorView from '@/views/MortgageCalculatorView.vue'
import MortgageForm from '@/components/Mortgage/MortgageForm.vue'
import MortgageRatesTable from '@/components/Mortgage/MortgageRatesTable.vue'

vi.mock('@/api/mortgageApi.ts', () => ({
  fetchMortgageRates: vi.fn(),
}))

vi.mock('@vueuse/core', () => ({
  useElementVisibility: vi.fn(() => ({ value: false })),
}))

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
})

import { fetchMortgageRates } from '@/api/mortgageApi.ts'
import { useElementVisibility } from '@vueuse/core'

const mockFetchMortgageRates = vi.mocked(fetchMortgageRates)
const mockUseElementVisibility = vi.mocked(useElementVisibility)

describe('MortgageCalculatorView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseElementVisibility.mockReturnValue(ref(false))
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('renders the page title correctly', () => {
    const wrapper = mount(MortgageCalculatorView)

    expect(wrapper.find('h1').text()).toBe('Mortgage Calculator')
  })

  it('renders MortgageForm component', () => {
    const wrapper = mount(MortgageCalculatorView)

    const mortgageForm = wrapper.findComponent(MortgageForm)
    expect(mortgageForm.exists()).toBe(true)
  })

  it('does not show rates table initially', () => {
    const wrapper = mount(MortgageCalculatorView)

    const ratesTable = wrapper.findComponent(MortgageRatesTable)
    expect(ratesTable.exists()).toBe(false)
  })

  it('does not show error message initially', () => {
    const wrapper = mount(MortgageCalculatorView)

    const errorDiv = wrapper.find('[data-test-id="rates-load-error"]')
    expect(errorDiv.exists()).toBe(false)
  })

  it('passes processing state to MortgageForm', () => {
    const wrapper = mount(MortgageCalculatorView)

    const mortgageForm = wrapper.findComponent(MortgageForm)
    expect(mortgageForm.props('processing')).toBe(false)
  })

  it('fetches rates successfully and displays table', async () => {
    const mockRatesResponse = {
      '15': { borrowingRate: 2.5, monthlyRate: 123 },
      '30': { borrowingRate: 3, monthlyRate: 234 },
    }

    mockFetchMortgageRates.mockResolvedValueOnce(mockRatesResponse)

    const wrapper = mount(MortgageCalculatorView)
    const mortgageForm = wrapper.findComponent(MortgageForm)

    await mortgageForm.vm.$emit('submit', {
      propertyPrice: 200000,
      loanAmount: 150000,
      annualRepayRate: 2.5,
    })

    await nextTick()

    expect(mockFetchMortgageRates).toHaveBeenCalledWith({
      propertyPrice: 200000,
      loanAmount: 150000,
      annualRepayRate: 2.5,
    })

    const ratesTable = wrapper.findComponent(MortgageRatesTable)
    expect(ratesTable.exists()).toBe(true)
    expect(ratesTable.props('loading')).toBe(false)
  })

  it('shows loading state during API call', async () => {
    mockFetchMortgageRates.mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(MortgageCalculatorView)
    const mortgageForm = wrapper.findComponent(MortgageForm)

    await mortgageForm.vm.$emit('submit', {
      propertyPrice: 200000,
      loanAmount: 150000,
      annualRepayRate: 2.5,
    })

    await nextTick()

    expect(mortgageForm.props('processing')).toBe(true)
  })

  it('handles API error and shows error message', async () => {
    mockFetchMortgageRates.mockRejectedValueOnce(new Error('API Error'))

    const wrapper = mount(MortgageCalculatorView)
    const mortgageForm = wrapper.findComponent(MortgageForm)

    await mortgageForm.vm.$emit('submit', {
      propertyPrice: 200000,
      loanAmount: 150000,
      annualRepayRate: 2.5,
    })

    await nextTick()

    const errorDiv = wrapper.find('[data-test="rates-load-error"]')

    expect(errorDiv.exists()).toBe(true)
    expect(errorDiv.text()).toContain('We could not calculate rates for the provided data')

    const ratesTable = wrapper.findComponent(MortgageRatesTable)
    expect(ratesTable.exists()).toBe(false)
  })

  it('clears rates when form changes', async () => {
    const mockRatesResponse = {
      '15': { borrowingRate: 2.5, monthlyRate: 123 },
    }

    mockFetchMortgageRates.mockResolvedValueOnce(mockRatesResponse)

    const wrapper = mount(MortgageCalculatorView)
    const mortgageForm = wrapper.findComponent(MortgageForm)

    // First submit to get rates
    await mortgageForm.vm.$emit('submit', {
      propertyPrice: 200000,
      loanAmount: 150000,
      annualRepayRate: 2.5,
    })

    await nextTick()

    let ratesTable = wrapper.findComponent(MortgageRatesTable)
    expect(ratesTable.exists()).toBe(true)

    // Then trigger form change
    await mortgageForm.vm.$emit('change')
    await nextTick()

    ratesTable = wrapper.findComponent(MortgageRatesTable)
    expect(ratesTable.exists()).toBe(false)
  })

  it('clears error when new submission starts', async () => {
    // First, trigger an error
    mockFetchMortgageRates.mockRejectedValueOnce(new Error('API Error'))

    const wrapper = mount(MortgageCalculatorView)
    const mortgageForm = wrapper.findComponent(MortgageForm)

    await mortgageForm.vm.$emit('submit', {
      propertyPrice: 200000,
      loanAmount: 150000,
      annualRepayRate: 2.5,
    })

    await nextTick()

    let errorDiv = wrapper.find('[data-test="rates-load-error"]')

    expect(errorDiv.exists()).toBe(true)

    // Then make a successful request
    mockFetchMortgageRates.mockResolvedValueOnce({
      '15': { borrowingRate: 2.5, monthlyRate: 123 },
    })

    await mortgageForm.vm.$emit('submit', {
      propertyPrice: 200000,
      loanAmount: 150000,
      annualRepayRate: 2.5,
    })

    await nextTick()

    errorDiv = wrapper.find('[data-test="rates-load-error"]')
    expect(errorDiv.exists()).toBe(false)
  })

  it('transforms API response correctly', async () => {
    const mockRatesResponse = {
      '15': { borrowingRate: 2.5, monthlyRate: 123 },
      '30': { borrowingRate: 3, monthlyRate: 234 },
    }

    mockFetchMortgageRates.mockResolvedValueOnce(mockRatesResponse)

    const wrapper = mount(MortgageCalculatorView)
    const mortgageForm = wrapper.findComponent(MortgageForm)

    await mortgageForm.vm.$emit('submit', {
      propertyPrice: 200000,
      loanAmount: 150000,
      annualRepayRate: 2.5,
    })

    await nextTick()

    const ratesTable = wrapper.findComponent(MortgageRatesTable)
    const rates = ratesTable.props('rates')

    expect(rates).toHaveLength(2)
    expect(rates[0]).toEqual({
      years: '15',
      borrowingRate: 2.5,
      monthlyRate: 123,
    })
    expect(rates[1]).toEqual({
      years: '30',
      borrowingRate: 3,
      monthlyRate: 234,
    })
  })
})
