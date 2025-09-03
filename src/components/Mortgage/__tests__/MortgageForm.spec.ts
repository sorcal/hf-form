import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MortgageForm from '@/components/Mortgage/MortgageForm.vue'
import NumberInput from '@/components/common/NumberInput.vue'
import BooleanInput from '@/components/common/BooleanInput.vue'
import SmallCardWithValue from '@/components/common/SmallCardWithValue.vue'

describe('MortgageForm', () => {
  const defaultProps = {
    processing: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form inputs correctly', () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
      global: {
        stubs: {
          NumberInput: true,
          BooleanInput: true,
          SmallCardWithValue: true,
        },
      },
    })

    const numberInputs = wrapper.findAllComponents(NumberInput)
    const booleanInput = wrapper.findComponent(BooleanInput)
    const cards = wrapper.findAllComponents(SmallCardWithValue)

    expect(numberInputs).toHaveLength(3)
    expect(booleanInput.exists()).toBe(true)
    expect(cards).toHaveLength(2)
  })

  it('initializes with default form data', () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    const numberInputs = wrapper.findAllComponents(NumberInput)

    expect(numberInputs[0].props('modelValue')).toBe(150000) // Purchase price
    expect(numberInputs[1].props('modelValue')).toBe(30000) // Total savings
    expect(numberInputs[2].props('modelValue')).toBe(2) // Annual repay rate
  })

  it('updates purchase price and validates form', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    const purchasePriceInput = wrapper.findComponent<typeof NumberInput>(
      '[data-test="property-price-input"]',
    )

    await purchasePriceInput.vm.$emit('update:modelValue', 200000)
    await nextTick()

    expect(purchasePriceInput.props('modelValue')).toBe(200000)
  })

  it('updates total savings and validates form', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    const totalSavingsInput = wrapper.findComponent<typeof NumberInput>(
      '[data-test="savings-input"]',
    )

    await totalSavingsInput.vm.$emit('update:modelValue', 50000)
    await nextTick()

    expect(totalSavingsInput.props('modelValue')).toBe(50000)
  })

  it('updates annual repay rate and validates form', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    const repayRateInput = wrapper.findComponent<typeof NumberInput>(
      '[data-test="repayment-rate-input"]',
    )

    await repayRateInput.vm.$emit('update:modelValue', 3.5)
    await nextTick()

    expect(repayRateInput.props('modelValue')).toBe(3.5)
  })

  it('shows validation errors in inputs', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    const purchasePriceInput = wrapper.findComponent<typeof NumberInput>(
      '[data-test="property-price-input"]',
    )

    // Update with invalid value
    await purchasePriceInput.vm.$emit('update:modelValue', 5000)
    await nextTick()

    expect(purchasePriceInput.props('error')).toBe('Purchase price must be at least 10000.')
  })

  it('disables inputs when processing', () => {
    const wrapper = mount(MortgageForm, {
      props: { processing: true },
    })

    const numberInputs = wrapper.findAllComponents(NumberInput)
    const booleanInput = wrapper.findComponent(BooleanInput)

    numberInputs.forEach((input) => {
      expect(input.props('disabled')).toBe(true)
    })
    expect(booleanInput.props('disabled')).toBe(true)
  })

  it('disables submit button when form is invalid', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    const purchasePriceInput = wrapper.findComponent<typeof NumberInput>(
      '[data-test="property-price-input"]',
    )

    // Make form invalid
    await purchasePriceInput.vm.$emit('update:modelValue', null)
    await nextTick()

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('enables submit button when form is valid', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    await nextTick()

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()
  })

  it('shows loading state when processing', () => {
    const wrapper = mount(MortgageForm, {
      props: { processing: true },
    })

    const submitButton = wrapper.find('button[type="submit"]')
    const loader = wrapper.find('.animate-spin')

    expect(submitButton.attributes('disabled')).toBeDefined()
    expect(loader.exists()).toBe(true)
  })

  it('emits submit event with correct data on form submission', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    await wrapper.find('form').trigger('submit')
    await nextTick()

    const emitted = wrapper.emitted('submit')
    expect(emitted).toHaveLength(1)
    expect(emitted?.[0]?.[0]).toEqual({
      loanAmount: expect.any(Number),
      propertyPrice: 150000,
      annualRepayRate: 2,
    })
  })

  it('emits change event when form data changes', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    const purchasePriceInput = wrapper.findComponent<typeof NumberInput>(
      '[data-test="property-price-input"]',
    )

    await purchasePriceInput.vm.$emit('update:modelValue', 200000)
    await nextTick()

    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('displays calculated implied loan value', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    await nextTick()

    const impliedLoanCard = wrapper.findAllComponents(SmallCardWithValue)[0]
    expect(impliedLoanCard.props('title')).toBe('Implied Loan')
  })

  it('displays calculated loan to value percentage', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    await nextTick()

    const loanToValueCard = wrapper.findAllComponents(SmallCardWithValue)[1]
    expect(loanToValueCard.props('title')).toBe('Loan to Value')
  })

  it('toggles real estate commission correctly', async () => {
    const wrapper = mount(MortgageForm, {
      props: defaultProps,
    })

    const booleanInput = wrapper.findComponent(BooleanInput)

    await booleanInput.vm.$emit('update:modelValue', true)
    await nextTick()

    expect(booleanInput.props('modelValue')).toBe(true)
  })
})
