<template>
  <div class="shadow-lg rounded-lg p-4 border border-gray-50">
    <div class="text-sm" v-text="title" />
    <div class="text-3xl mt-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
