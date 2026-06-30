// Cross-cutting context for the recursive SurfaceRenderer: the host (RecordForm/RecordDetail)
// provides the mode + a field resolver + the value get/set, and deep `field` nodes inject it —
// so the renderer needn't prop-drill schema/values through every level.
import { inject, provide, type InjectionKey } from 'vue'
import type { FieldVm } from './fieldVm'

export interface SurfaceContext {
  mode: 'form' | 'detail'
  field: (key: string) => FieldVm | undefined
  getValue: (key: string) => unknown
  setValue: (key: string, value: unknown) => void
  // The record being shown (detail surface) — lets nodes like `related-records` query its links.
  recordId?: number
}

const KEY: InjectionKey<SurfaceContext> = Symbol('surfaceContext')

export function provideSurfaceContext(ctx: SurfaceContext): void {
  provide(KEY, ctx)
}

export function useSurfaceContext(): SurfaceContext {
  const ctx = inject(KEY)
  if (!ctx) {
    throw new Error('SurfaceRenderer field used outside a surface-context provider.')
  }
  return ctx
}

/** Optional variant — surfaces without record values (e.g. nav) render without a provider. */
export function useSurfaceContextOptional(): SurfaceContext | undefined {
  return inject(KEY, undefined)
}
