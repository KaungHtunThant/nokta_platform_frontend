// Pinia store = MODEL layer: holds typed state + PURE synchronous manipulation only.
// No async, no API calls, no business logic (see TECHNICAL-STRUCTURE Part B).
// A util fetches /me/abilities, maps it, and assigns the typed result here.
//
// Op/ui sets gate coarse actions/rendering; the stage/field matrices gate per-object UI. None of
// this is a security boundary — the server re-checks every mutation (op guard + FieldGate).
import { defineStore } from 'pinia'

export interface StageAccess {
  canMoveFrom: boolean
  canMoveTo: boolean
  canView: boolean
}

export interface FieldAccess {
  canRead: boolean
  canUpdate: boolean
  uiVisible: boolean
}

export interface Abilities {
  op: ReadonlySet<string>
  ui: ReadonlySet<string>
  stages: Readonly<Record<number, StageAccess>>
  fields: Readonly<Record<string, FieldAccess>>
}

interface State {
  abilities: Abilities
}

function emptyAbilities(): Abilities {
  return { op: new Set<string>(), ui: new Set<string>(), stages: {}, fields: {} }
}

export const useAbilityStore = defineStore('ability', {
  state: (): State => ({ abilities: emptyAbilities() }),
  getters: {
    canDo: (s) => (op: string): boolean => s.abilities.op.has(op),
    canSee: (s) => (ui: string): boolean => s.abilities.ui.has(ui),
    // Matrices are restrict-only: a field/stage with no configured row is fully open.
    fieldVisible: (s) => (key: string): boolean => s.abilities.fields[key]?.uiVisible ?? true,
    canReadField: (s) => (key: string): boolean => s.abilities.fields[key]?.canRead ?? true,
    canUpdateField: (s) => (key: string): boolean => s.abilities.fields[key]?.canUpdate ?? true,
    canMoveToStage: (s) => (stageId: number): boolean => s.abilities.stages[stageId]?.canMoveTo ?? true,
    canMoveFromStage: (s) => (stageId: number): boolean => s.abilities.stages[stageId]?.canMoveFrom ?? true,
  },
  actions: {
    // pure setter — the controller util builds the typed value and assigns it
    setAbilities(abilities: Abilities): void {
      this.abilities = abilities
    },
    clear(): void {
      this.abilities = emptyAbilities()
    },
  },
})
