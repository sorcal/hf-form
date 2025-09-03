<template>
  <main class="max-w-2xl mx-auto py-12">
    <h1 class="text-xl font-semibold">Mortgage Calculator</h1>
    <MortgageForm
      class="mt-4"
      @submit="getRates"
      @change="onFormChange"
      :processing="ratesLoading"
    />

    <MortgageRatesTable
      v-if="rates.length"
      class="mt-12 shadow-lg rounded-lg border border-gray-50 px-4"
      :rates="rates"
    />

    <!-- Probably better to show this error as a toast message  -->
    <div
      v-if="ratesLoadError"
      class="mt-12 shadow-lg rounded-lg border border-gray-50 flex gap-x-2 p-4"
    >
      <ExclamationIcon class="text-red-500" />
      <span v-text="ratesLoadError" />
    </div>
  </main>
</template>

<script setup lang="ts">
import MortgageForm from '../components/Mortgage/MortgageForm.vue'
import MortgageRatesTable from '@/components/Mortgage/MortgageRatesTable.vue'
import ExclamationIcon from '@/components/icons/exclamation-circle.svg?component'
import { ref } from 'vue'
import { fetchMortgageRates, type Rate } from '@/api/mortgageApi.ts'

interface RateWithYears extends Rate {
  years: string
}

const rates = ref<RateWithYears[]>([])
const ratesLoading = ref(false)
const ratesLoadError = ref('')

async function getRates(data: {
  propertyPrice: number
  loanAmount: number
  annualRepayRate: number
}) {
  rates.value = []
  ratesLoading.value = true
  ratesLoadError.value = ''

  try {
    const res = await fetchMortgageRates({
      propertyPrice: data.propertyPrice!,
      loanAmount: data.loanAmount,
      annualRepayRate: data.annualRepayRate!,
    })

    rates.value = Object.entries(res).map(([key, value]) => ({
      years: key,
      ...value,
    }))
  } catch {
    ratesLoadError.value =
      'We could not calculate rates for the provided data. Please change your input data and try again later.'
  } finally {
    ratesLoading.value = false
  }
}

function onFormChange() {
  // just to hide outdated table is the simplest way for the test task
  // I'm also thinking about keeping the old data or the table row count but in a way that it's clear that the data is outdated
  rates.value = []
}
</script>
