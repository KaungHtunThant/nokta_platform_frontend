// Subscribe to the tenant-scoped config channel and invalidate caches on layout/schema changes, so
// runtime + builder sessions live-update (ARCHITECTURE §5). No-op if Echo isn't configured.
import type Echo from 'laravel-echo'
import { refreshLayout, refreshSchemas } from '~/lib/realtime/configInvalidation'

export function useConfigChannel(tenantId: number): () => void {
  const echo = useNuxtApp().$echo as Echo<'reverb'> | undefined
  if (!echo) return () => {}

  const name = `tenant.${tenantId}.config`
  echo.private(name)
    .listen('.layout.published', (payload: { surface: string, key: string }) => {
      void refreshLayout(payload.surface, payload.key)
    })
    .listen('.field-definition.changed', () => {
      void refreshSchemas()
    })

  return () => { echo.leave(name) }
}
