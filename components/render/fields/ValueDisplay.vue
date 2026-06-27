<script setup lang="ts">
// Read-only display for ALL field types (detail surface). Type-specific formatting lives in the
// pure formatFieldValue() so this component stays trivial and one display covers every type.
import { computed } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'
import { formatFieldValue } from '~/lib/render/displayValue'

const props = defineProps<{ value: unknown, field: FieldVm }>()

const text = computed(() => formatFieldValue(props.field, props.value))
</script>

<template>
  <span>{{ text }}</span>
</template>
