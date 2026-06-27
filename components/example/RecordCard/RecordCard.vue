<script setup lang="ts">
// VIEW: UI/UX only, minimal script. Receives a typed model; pulls style from the design module.
// No business logic, no API calls (those live in RecordCard.utils.ts / .model.ts / .design.ts).
import type { RecordCardModel } from './RecordCard.model'
import { cardStyle, hoverTransition } from './RecordCard.design'

defineProps<{ model: RecordCardModel }>()
</script>

<template>
  <article :style="{ ...cardStyle, transition: hoverTransition }">
    <h3>{{ model.title }}</h3>
    <small>Updated {{ model.updatedAt }}</small>
  </article>
</template>
