<template>
  <div class="shadow-lg rounded-lg p-4 border border-gray-100">
    <div class="text-sm" v-text="title" />
    <div class="text-3xl mt-2" v-text="text" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  text: string
}>()
</script>
