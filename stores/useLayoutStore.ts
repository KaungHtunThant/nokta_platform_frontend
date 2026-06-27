// MODEL layer — pure typed cache of resolved layouts, keyed by "surface:key". No async/API here.
import { defineStore } from 'pinia'
import type { LayoutDto } from '~/types/schema'

interface State {
  byKey: Record<string, LayoutDto>
}

function id(surface: string, key: string): string {
  return `${surface}:${key}`
}

export const useLayoutStore = defineStore('layout', {
  state: (): State => ({ byKey: {} }),
  getters: {
    get: (s) => (surface: string, key: string): LayoutDto | undefined => s.byKey[id(surface, key)],
  },
  actions: {
    setLayout(layout: LayoutDto): void {
      this.byKey[id(layout.surface, layout.key)] = layout
    },
  },
})
