<template>
  <div class="flex flex-col">
    <label :for="inputId" class="text-sm" v-text="label" />
    <input
      :id="inputId"
      type="number"
      :placeholder="placeholder"
      class="border p-2 rounded-sm mt-1"
      :class="{
        'border-red-500': error,
        'border-gray-600': !error,
        'opacity-50': disabled,
      }"
      :value="modelValue"
      :disabled="disabled"
      @blur="onBlur"
    />
    <div v-if="error" class="text-xs text-red-500" v-text="error" data-test="input-error" />
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  label: string
  placeholder: string
  modelValue: number | null
  error: string
  disabled: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const inputId = useId()

function onBlur(event: Event) {
  const valueStr = (event.target as HTMLInputElement)?.value || ''
  if (!valueStr) {
    emit('update:modelValue', null)
    return
  }

  const value = parseFloat(valueStr)

  emit('update:modelValue', value)
}
</script>
