<template>
  <main class="max-w-2xl mx-auto py-12 px-4">
    <h1 class="text-xl font-semibold">Mortgage Calculator</h1>
    <MortgageForm
      class="mt-4"
      @submit="getRates"
      @change="onFormChange"
      :processing="ratesLoading"
    />

    <div ref="ratesTable">
      <MortgageRatesTable
        v-if="rates.length"
        class="mt-12 shadow-lg rounded-lg border border-gray-50 px-4"
        :rates="rates"
        :loading="ratesLoading"
      />
    </div>

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
import { useElementVisibility } from '@vueuse/core'
import { nextTick, useTemplateRef, watch } from 'vue'
import { ref } from 'vue'
import { fetchMortgageRates, type Rate } from '@/api/mortgageApi.ts'
import MortgageForm from '../components/Mortgage/MortgageForm.vue'
import MortgageRatesTable from '@/components/Mortgage/MortgageRatesTable.vue'
import ExclamationIcon from '@/components/icons/exclamation-circle.svg?component'

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
    rates.value = []
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

const ratesTableRef = useTemplateRef<HTMLDivElement>('ratesTable')
const ratesTableIsVisible = useElementVisibility(ratesTableRef, {
  threshold: 0.5,
})

watch(rates, async () => {
  if (rates.value.length > 0 && !ratesTableIsVisible.value) {
    await nextTick()
    ratesTableRef.value?.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>
