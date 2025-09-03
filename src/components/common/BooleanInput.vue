<template>
  <div class="flex flex-col">
    <label class="text-sm" v-text="label" />
    <div class="space-x-4 py-2">
      <span class="space-x-1">
        <input
          type="radio"
          :id="`${fieldId}-1`"
          :name="`${fieldId}-name`"
          value="1"
          @input="onSelect(true)"
          :checked="modelValue"
          :disabled="disabled"
        />
        <label :for="`${fieldId}-1`">Yes</label>
      </span>

      <span class="space-x-1">
        <input
          type="radio"
          :id="`${fieldId}-0`"
          :name="`${fieldId}-name`"
          value="0"
          @input="onSelect(false)"
          :checked="!modelValue"
          :disabled="disabled"
        />
        <label :for="`${fieldId}-0`">No</label>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  label: string
  modelValue: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const fieldId = useId()

function onSelect(value: boolean) {
  emit('update:modelValue', value)
}
</script>
