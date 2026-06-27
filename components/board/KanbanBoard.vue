<script setup lang="ts">
// VIEW: config-driven kanban. Columns come from the board store (stages from the API); each card
// renders the `card` layout via SurfaceRenderer. Native drag-to-move calls the move use-case
// (optimistic + rollback) and surfaces policy rejections. Subscribes to the tenant board channel.
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BoardCard from './BoardCard.vue'
import { loadBoard, moveCard } from './KanbanBoard.utils'
import type { FieldVm } from '~/lib/render/fieldVm'
import type { LayoutNode } from '~/types/schema'
import { useRecordStore } from '~/stores/useRecordStore'
import { useAuthStore } from '~/stores/useAuthStore'
import { useBoardChannel } from '~/composables/useBoardChannel'
import { boardStyle, columnStyle, columnHeaderStyle, countStyle, cardWrapStyle, errorStyle } from './KanbanBoard.design'

const props = defineProps<{ entityKey: string }>()

const store = useRecordStore()
const cardNode = ref<LayoutNode | null>(null)
const fields = ref<Map<string, FieldVm>>(new Map())
const loading = ref(true)
const error = ref<string | null>(null)

const dragId = ref<number | null>(null)
const dragFrom = ref<number | null>(null)

let unsubscribe: () => void = () => {}

onMounted(async () => {
  const view = await loadBoard(props.entityKey)
  cardNode.value = view.cardNode
  fields.value = view.fields
  loading.value = false

  const tenantId = useAuthStore().tenantId
  if (tenantId != null) {
    unsubscribe = useBoardChannel(props.entityKey, tenantId, payload => store.applyRemoteMove(payload))
  }
})

onBeforeUnmount(() => unsubscribe())

function onDragStart(recordId: number, stageId: number): void {
  dragId.value = recordId
  dragFrom.value = stageId
}

async function onDrop(toStageId: number): Promise<void> {
  const id = dragId.value
  const from = dragFrom.value
  dragId.value = null
  dragFrom.value = null
  if (id == null || from == null || from === toStageId) return

  error.value = null
  try {
    await moveCard(id, from, toStageId)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Move failed.'
  }
}
</script>

<template>
  <div>
    <p v-if="loading">Loading board…</p>
    <template v-else>
      <p v-if="error" :style="errorStyle">{{ error }}</p>
      <div :style="boardStyle">
        <section
          v-for="col in store.columns"
          :key="col.stage.id"
          :style="{ ...columnStyle, borderTop: `3px solid ${col.stage.color ?? '#cbd2d9'}` }"
          @dragover.prevent
          @drop="onDrop(col.stage.id)"
        >
          <header :style="columnHeaderStyle">
            <span>{{ col.stage.label }}</span>
            <span :style="countStyle">{{ col.meta.total }}</span>
          </header>

          <div
            v-for="record in col.records"
            :key="record.id"
            :style="cardWrapStyle"
            draggable="true"
            @dragstart="onDragStart(record.id, col.stage.id)"
          >
            <BoardCard v-if="cardNode" :fields="fields" :data="record.data" :card-node="cardNode" />
          </div>
        </section>
      </div>
    </template>
  </div>
</template>
