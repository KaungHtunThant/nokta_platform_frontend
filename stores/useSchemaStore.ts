// MODEL layer — pure typed cache of entity schemas, keyed by entity type. No async/API here.
import { defineStore } from 'pinia'
import type { EntitySchemaDto } from '~/types/schema'

interface State {
  byKey: Record<string, EntitySchemaDto>
}

export const useSchemaStore = defineStore('schema', {
  state: (): State => ({ byKey: {} }),
  getters: {
    get: (s) => (entityKey: string): EntitySchemaDto | undefined => s.byKey[entityKey],
  },
  actions: {
    setSchema(schema: EntitySchemaDto): void {
      this.byKey[schema.key] = schema
    },
  },
})
