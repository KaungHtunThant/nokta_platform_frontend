// MODEL layer for the layout builder: the draft node tree being edited + selection + dirty state.
// Pure setters only (no API). The builder controller util fetches/saves; tree edits are computed by
// the pure helpers in lib/builder/layoutTree and assigned here via setRoot.
import { defineStore } from 'pinia'
import type { LayoutNode } from '~/types/schema'
import { findNode } from '~/lib/builder/layoutTree'

interface State {
  surface: string | null
  key: string | null
  root: LayoutNode | null
  baseVersion: number | null
  selectedId: string | null
  dirty: boolean
}

export const useBuilderStore = defineStore('builder', {
  state: (): State => ({ surface: null, key: null, root: null, baseVersion: null, selectedId: null, dirty: false }),
  getters: {
    selected: (s): LayoutNode | undefined => (s.root && s.selectedId ? findNode(s.root, s.selectedId) : undefined),
  },
  actions: {
    // Load a layout into the builder (clean slate, not dirty).
    load(surface: string, key: string, root: LayoutNode, version: number): void {
      this.surface = surface
      this.key = key
      this.root = root
      this.baseVersion = version
      this.selectedId = null
      this.dirty = false
    },
    // Replace the tree after an edit (marks dirty).
    setRoot(root: LayoutNode): void {
      this.root = root
      this.dirty = true
    },
    select(id: string | null): void {
      this.selectedId = id
    },
    markClean(version?: number): void {
      this.dirty = false
      if (version !== undefined) this.baseVersion = version
    },
    reset(): void {
      this.$reset()
    },
  },
})
