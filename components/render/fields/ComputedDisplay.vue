<script setup lang="ts">
// Read-only widget for `computed` fields. Their value is derived server-side on write, so this is
// used as the "input" in form mode too — it never emits, keeping the field non-editable. Formatting
// delegates to the shared formatFieldValue (by the field's result_type).
import { computed } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'
import { formatFieldValue } from '~/lib/render/displayValue'

const props = defineProps<{ value?: unknown, modelValue?: unknown, field: FieldVm }>()

const text = computed(() => formatFieldValue(props.field, props.value ?? props.modelValue))
</script>

<template>
  <span style="color: #6b7280" :title="`Computed: ${text}`">{{ text }}</span>
</template>
