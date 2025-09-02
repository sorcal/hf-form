<template>
  <main class="max-w-2xl mx-auto py-12">
    <h1 class="text-xl font-semibold">Mortgage Calculator</h1>
    <MortgageForm class="mt-4" @submit="getRates" />

    <MortgageRatesTable class="mt-8" :rates="rates" />
  </main>
</template>

<script setup lang="ts">
import MortgageForm from '../components/MortgageForm.vue'
import MortgageRatesTable from '@/components/MortgageRatesTable.vue'
import { ref } from 'vue'
import { fetchRates, type Rate } from '@/api/mortgageApi.ts'

interface RateWithYears extends Rate {
  years: string
}

const rates = ref<RateWithYears[]>([])

async function getRates(data) {
  // validate all fields

  rates.value = []

  const loanAmount = data.purchasePrice! - data.totalSavings!

  try {
    const res = await fetchRates({
      purchasePrice: data.annualRepayRate!,
      loanAmount: loanAmount,
      annualRepayRate: data.annualRepayRate!,
    })

    console.log(res)

    rates.value = Object.entries(res).map(([key, value]) => ({
      years: key,
      ...value,
    }))
  } catch {
    // TODO handle error
  }
}
</script>
