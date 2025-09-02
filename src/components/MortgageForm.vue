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
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
      >
        Submit
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
      <SmallCardWithValue title="Implied Loan" :text="`${Math.round(impliedLoan)} €`" />
      <SmallCardWithValue title="Loan to Value" :text="`${loanToValue.toFixed(2)} %`" />
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
}

function updateTotalSavings(newValue: number | null) {
  formData.totalSavings = newValue
  validateTotalSavings()
}

function updateAnnualRepayRate(newValue: number | null) {
  formData.annualRepayRate = newValue
}

function validatePurchasePrice() {
  if (!formData.purchasePrice) {
    formDataErrors.purchasePrice = 'Purchase price is required.'
    return
  }

  if (formData.purchasePrice < 0) {
    formDataErrors.purchasePrice = 'Purchase price must be greater than zero.'
    return
  }

  // TODO tweak this validation to show only error for one price field
  if (formData.totalSavings && formData.totalSavings >= formData.purchasePrice) {
    formDataErrors.purchasePrice = 'Purchase price must be greater than total savings.'
    return
  }

  formDataErrors.purchasePrice = ''
}

function validateTotalSavings() {
  if (!formData.totalSavings) {
    formDataErrors.totalSavings = 'Total savings is required.'
    return
  }

  if (formData.totalSavings < 0) {
    formDataErrors.totalSavings = 'Total savings must be greater than zero.'
    return
  }

  if (formData.purchasePrice && formData.purchasePrice <= formData.totalSavings) {
    formDataErrors.totalSavings = 'Total savings must be less than purchase price.'
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

watch(
  formData,
  async () => {
    if (!formData.purchasePrice || !formData.totalSavings || !isFormValid.value) {
      return 0
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
