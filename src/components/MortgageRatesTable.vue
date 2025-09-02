<template>
  <div>
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full py-2 align-middle">
        <table class="relative min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Fixation Length
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Monthly Rate
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Interest Rate
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="rate in rates" :key="rate.years">
              <td
                class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
              >
                {{ rate.years }} Years
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ rate.monthlyRate }} €
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ rate.borrowingRate.toFixed(2) }} %
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  rates: Array<{
    years: string
    monthlyRate: number
    borrowingRate: number
  }>
}>()
</script>
