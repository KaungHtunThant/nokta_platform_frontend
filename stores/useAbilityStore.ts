// Pinia store = MODEL layer: holds typed state + PURE synchronous manipulation only.
// No async, no API calls, no business logic (see TECHNICAL-STRUCTURE Part B).
// A util fetches /me/abilities, maps it, and assigns the typed result here.
import { defineStore } from 'pinia'

export interface Abilities {
  op: ReadonlySet<string>
  ui: ReadonlySet<string>
}

interface State {
  abilities: Abilities
}

export const useAbilityStore = defineStore('ability', {
  state: (): State => ({
    abilities: { op: new Set<string>(), ui: new Set<string>() },
  }),
  getters: {
    canDo: (s) => (op: string): boolean => s.abilities.op.has(op),
    canSee: (s) => (ui: string): boolean => s.abilities.ui.has(ui),
  },
  actions: {
    // pure setter — the controller util builds the typed value and assigns it
    setAbilities(abilities: Abilities): void {
      this.abilities = abilities
    },
  },
})
