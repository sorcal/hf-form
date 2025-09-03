<template>
  <form @submit.prevent="onSubmit">
    <div class="shadow-lg rounded-lg border border-gray-50 p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput
          label="Property Purchase Price (€)"
          placeholder="Enter price"
          :model-value="formData.purchasePrice"
          :error="formDataErrors.purchasePrice"
          :disabled="processing"
          @update:modelValue="updatePurchasePrice($event)"
        />

        <NumberInput
          label="Total Savings (€)"
          placeholder="Enter your savings"
          :model-value="formData.totalSavings"
          :error="formDataErrors.totalSavings"
          :disabled="processing"
          @update:modelValue="updateTotalSavings($event)"
        />

        <BooleanInput
          label="Real Estate Commission"
          v-model="formData.realEstateCommission"
          :disabled="processing"
        />

        <NumberInput
          label="Annual Repayment Rate (%)"
          placeholder="Enter rate"
          :model-value="formData.annualRepayRate"
          :error="formDataErrors.annualRepayRate"
          :disabled="processing"
          @update:modelValue="updateAnnualRepayRate($event)"
        />
      </div>
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="!isFormValid || processing"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors duration-200 flex items-center"
          :class="{
            'opacity-50 cursor-not-allowed': !isFormValid || processing,
            'cursor-pointer': isFormValid || processing,
          }"
        >
          <LoaderIcon v-if="processing" class="mr-3 -ml-1 size-5 animate-spin text-white" />
          Submit
        </button>
      </div>
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
import { computed, reactive, watch } from 'vue'
import BooleanInput from '@/components/common/BooleanInput.vue'
import NumberInput from '@/components/common/NumberInput.vue'
import SmallCardWithValue from '@/components/common/SmallCardWithValue.vue'
import LoaderIcon from '@/components/icons/loader.svg?component'
import { calculateImpliedLoan, calculateLoanToValue } from '@/utils/loans.ts'
import {
  validateRepayRate,
  validatePurchasePrice,
  validateTotalSavings,
} from '@/components/Mortgage/validator.ts'

interface FormData {
  purchasePrice: number | null
  totalSavings: number | null
  annualRepayRate: number | null
  realEstateCommission: boolean
}

defineProps<{
  processing: boolean
}>()

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

  formDataErrors.purchasePrice = validatePurchasePrice(formData.purchasePrice)
  formDataErrors.totalSavings = validateTotalSavings(formData.totalSavings, formData.purchasePrice)
}

function updateTotalSavings(newValue: number | null) {
  formData.totalSavings = newValue

  formDataErrors.purchasePrice = validatePurchasePrice(formData.purchasePrice)
  formDataErrors.totalSavings = validateTotalSavings(formData.totalSavings, formData.purchasePrice)
}

function updateAnnualRepayRate(newValue: number | null) {
  formData.annualRepayRate = newValue

  formDataErrors.annualRepayRate = validateRepayRate(formData.annualRepayRate)
}

const isFormValid = computed(() => {
  return (
    !formDataErrors.purchasePrice && !formDataErrors.totalSavings && !formDataErrors.annualRepayRate
  )
})

// const impliedLoan = ref(0)
// const loanToValue = ref(0)

const impliedLoan = computed(() => {
  if (!isFormValid.value || !formData.purchasePrice || !formData.totalSavings) {
    return 0
  }

  return calculateImpliedLoan(
    formData.purchasePrice,
    formData.totalSavings,
    formData.realEstateCommission,
  )
})

const loanToValue = computed(() => {
  if (!isFormValid.value || !formData.purchasePrice) {
    return 0
  }

  return calculateLoanToValue(impliedLoan.value, formData.purchasePrice)
})

async function onSubmit() {
  // validate all fields

  emit('submit', {
    loanAmount: impliedLoan.value,
    propertyPrice: formData.purchasePrice!,
    annualRepayRate: formData.annualRepayRate!,
  })
}

const impliedLoanToShow = computed(() => {
  // if (!isFormValid.value) {
  //   return '0 €'
  // }

  return impliedLoan.value ? `${Math.round(impliedLoan.value)} €` : '0 €'
})

const loanToValueToShow = computed(() => {
  // if (!isFormValid.value) {
  //   return '0 %'
  // }

  return loanToValue.value ? `${loanToValue.value.toFixed(2)} %` : '0 %'
})

watch(
  formData,
  () => {
    emit('change')

    // if (!formData.purchasePrice || !formData.totalSavings || !isFormValid.value) {
    //   return
    // }
    //
    // impliedLoan.value = calculateImpliedLoan(
    //   formData.purchasePrice,
    //   formData.totalSavings,
    //   formData.realEstateCommission,
    // )
    //
    // loanToValue.value = calculateLoanToValue(impliedLoan.value, formData.purchasePrice)
  },
  {
    // immediate: true,
  },
)
</script>
