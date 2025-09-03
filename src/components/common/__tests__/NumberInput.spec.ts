import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberInput from '@/components/common/NumberInput.vue'

describe('NumberInput', () => {
  const defaultProps = {
    label: 'Test Label',
    placeholder: 'Enter number',
    modelValue: null,
    error: '',
    disabled: false,
  }

  let wrapper

  it('renders label and input correctly', () => {
    wrapper = mount(NumberInput, {
      props: defaultProps,
    })

    expect(wrapper.find('label').text()).toBe('Test Label')
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter number')
    expect(wrapper.find('input').attributes('type')).toBe('number')
  })

  it('displays the current value', () => {
    wrapper = mount(NumberInput, {
      props: {
        ...defaultProps,
        modelValue: 42,
      },
    })

    expect(wrapper.find('input').element.value).toBe('42')
  })

  it('shows error message when error prop is provided', () => {
    wrapper = mount(NumberInput, {
      props: {
        ...defaultProps,
        error: 'Invalid number',
      },
    })

    const errorDiv = wrapper.find('[data-test="input-error"]')
    expect(errorDiv.exists()).toBe(true)
    expect(errorDiv.text()).toBe('Invalid number')
  })

  it('does not show error div when no error', () => {
    wrapper = mount(NumberInput, {
      props: defaultProps,
    })

    expect(wrapper.find('[data-test="input-error"]').exists()).toBe(false)
  })

  it('applies disabled attribute when disabled', () => {
    wrapper = mount(NumberInput, {
      props: {
        ...defaultProps,
        disabled: true,
      },
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('emits update:modelValue with parsed number on blur', async () => {
    wrapper = mount(NumberInput, {
      props: defaultProps,
    })

    const input = wrapper.find('input')
    input.element.value = '123.45'
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([123.45])
  })

  it('emits update:modelValue with null when input is empty on blur', async () => {
    wrapper = mount(NumberInput, {
      props: defaultProps,
    })

    const input = wrapper.find('input')
    input.element.value = ''
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('emits update:modelValue with null when input contains only whitespace', async () => {
    wrapper = mount(NumberInput, {
      props: defaultProps,
    })

    const input = wrapper.find('input')
    input.element.value = '   '
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('handles negative numbers correctly', async () => {
    wrapper = mount(NumberInput, {
      props: defaultProps,
    })

    const input = wrapper.find('input')
    input.element.value = '-42.5'
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([-42.5])
  })

  it('handles decimal numbers correctly', async () => {
    wrapper = mount(NumberInput, {
      props: defaultProps,
    })

    const input = wrapper.find('input')
    input.element.value = '0.123'
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0.123])
  })
})
