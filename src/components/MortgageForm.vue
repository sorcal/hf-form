<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <PriceInput
        label="Property Purchase Price"
        placeholder="Enter price"
        :model-value="formData.purchasePrice"
        :error="formDataErrors.purchasePrice"
        @update:modelValue="updatePurchasePrice($event)"
      />

      <PriceInput
        label="Total Savings"
        placeholder="Enter your savings"
        :model-value="formData.totalSavings"
        :error="formDataErrors.totalSavings"
        @update:modelValue="updateTotalSavings($event)"
      />

      <BooleanInput label="Real Estate Commission" v-model="formData.realEstateCommission" />

      <NumberInput
        label="Annual Repayment Rate (%)"
        placeholder="Enter rate"
        :model-value="formData.annualRepayRate"
        :error="formDataErrors.annualRepayRate"
        @update:modelValue="updateAnnualRepayRate($event)"
      />
    </div>
    <div class="flex justify-end">
      <button
        type="submit"
        :disabled="!isFormValid"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
      >
        Submit
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
      <SmallCardWithValue title="Implied Loan">
        <span
          :class="{
            'text-gray-700': isFormValid,
            'text-gray-300': !isFormValid,
          }"
          v-text="impliedLoanToShow"
        />
      </SmallCardWithValue>
      <SmallCardWithValue title="Loan to Value">
        <span
          :class="{
            'text-gray-700': isFormValid,
            'text-gray-300': !isFormValid,
          }"
          v-text="loanToValueToShow"
        />
      </SmallCardWithValue>
    </div>
  </form>
</template>

<script setup lang="ts">
import PriceInput from '@/components/common/PriceInput.vue'
import { computed, reactive, ref, watch } from 'vue'
import BooleanInput from '@/components/common/BooleanInput.vue'
import NumberInput from '@/components/common/NumberInput.vue'
import SmallCardWithValue from '@/components/common/SmallCardWithValue.vue'
import { calculateImpliedLoan, calculateLoanToValue } from '@/utils/loans'

const MIN_PROPERTY_PRICE = 10000

interface FormData {
  purchasePrice: number | null
  totalSavings: number | null
  annualRepayRate: number | null
  realEstateCommission: boolean
}

const emit = defineEmits<{
  submit: [
    data: {
      loanAmount: number
      propertyPrice: number
      annualRepayRate: number
    },
  ]
  change: []
}>()

const formData = reactive<FormData>({
  purchasePrice: 150000,
  totalSavings: 30000,
  annualRepayRate: 2,
  realEstateCommission: false,
})

const formDataErrors = reactive<Record<keyof FormData, string>>({
  purchasePrice: '',
  totalSavings: '',
  annualRepayRate: '',
  realEstateCommission: '',
})

function updatePurchasePrice(newValue: number | null) {
  formData.purchasePrice = newValue

  validatePurchasePrice()
  validateTotalSavings()
}

function updateTotalSavings(newValue: number | null) {
  formData.totalSavings = newValue

  validatePurchasePrice()
  validateTotalSavings()
}

function updateAnnualRepayRate(newValue: number | null) {
  formData.annualRepayRate = newValue

  validateRepayRate()
}

function validatePurchasePrice() {
  if (formData.purchasePrice === null) {
    formDataErrors.purchasePrice = 'Purchase price is required.'
    return
  }

  if (formData.purchasePrice < MIN_PROPERTY_PRICE) {
    formDataErrors.purchasePrice = `Purchase price must be at least ${MIN_PROPERTY_PRICE}.`
    return
  }

  formDataErrors.purchasePrice = ''
}

function validateTotalSavings() {
  if (formData.totalSavings === null) {
    formDataErrors.totalSavings = 'Total savings is required.'
    return
  }

  if (formData.totalSavings <= 0) {
    formDataErrors.totalSavings = 'Total savings must be greater than zero.'
    return
  }

  /**
   * TODO should be a better condition for comparison between savings and price
   * e.g. it doesn't make sense to get a mortgage if purchasePrice=50000 and savings=49999
   */
  if (formData.purchasePrice && formData.purchasePrice <= formData.totalSavings) {
    formDataErrors.totalSavings = 'Total savings must be less than purchase price.'
    return
  }

  formDataErrors.totalSavings = ''
}

function validateRepayRate() {
  if (formData.annualRepayRate === null) {
    formDataErrors.annualRepayRate = 'Annual repayment rate is required.'
    return
  }

  if (formData.annualRepayRate <= 0 || formData.annualRepayRate >= 100) {
    formDataErrors.annualRepayRate = 'Annual repayment rate must be between 0 and 100.'
    return
  }

  formDataErrors.totalSavings = ''
}

const isFormValid = computed(() => {
  return (
    !formDataErrors.purchasePrice && !formDataErrors.totalSavings && !formDataErrors.annualRepayRate
  )
})

const impliedLoan = ref(0)
const loanToValue = ref(0)

async function onSubmit() {
  // validate all fields

  emit('submit', {
    loanAmount: impliedLoan.value,
    propertyPrice: formData.purchasePrice!,
    annualRepayRate: formData.annualRepayRate!,
  })
}

const impliedLoanToShow = computed(() => {
  if (!isFormValid.value) {
    return '0 €'
  }

  return impliedLoan.value ? `${Math.round(impliedLoan.value)} €` : '0 €'
})

const loanToValueToShow = computed(() => {
  if (!isFormValid.value) {
    return '0 %'
  }

  return loanToValue.value ? `${loanToValue.value.toFixed(2)} %` : '0 %'
})

watch(
  formData,
  () => {
    emit('change')

    if (!formData.purchasePrice || !formData.totalSavings || !isFormValid.value) {
      return
    }
    impliedLoan.value = calculateImpliedLoan(
      formData.purchasePrice,
      formData.totalSavings,
      formData.realEstateCommission,
    )

    loanToValue.value = calculateLoanToValue(impliedLoan.value, formData.purchasePrice)
  },
  {
    immediate: true,
  },
)
</script>
