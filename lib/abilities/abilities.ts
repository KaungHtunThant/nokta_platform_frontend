// Abilities controller util: fetches /me/abilities, maps the DTO to the store's typed model, and
// assigns it. Lives in lib/ (not the store) because stores are pure state and may not call the API.
import type { AbilitiesDto } from '~/types/dto'
import type { Abilities } from '~/stores/useAbilityStore'
import { meApi } from '~/lib/api/client'
import { useAbilityStore } from '~/stores/useAbilityStore'

/** Pure DTO → Model mapping (testable without a network). */
export function toAbilities(dto: AbilitiesDto): Abilities {
  const stages: Record<number, Abilities['stages'][number]> = {}
  for (const [id, a] of Object.entries(dto.stages ?? {})) {
    stages[Number(id)] = { canMoveFrom: a.can_move_from, canMoveTo: a.can_move_to, canView: a.can_view }
  }

  const fields: Record<string, Abilities['fields'][string]> = {}
  for (const [key, a] of Object.entries(dto.fields ?? {})) {
    fields[key] = { canRead: a.can_read, canUpdate: a.can_update, uiVisible: a.ui_visible }
  }

  return { op: new Set(dto.op ?? []), ui: new Set(dto.ui ?? []), stages, fields }
}

/** Fetch the active tenant's abilities and populate the store. Call on bootstrap + tenant switch. */
export async function loadAbilities(): Promise<void> {
  const dto = await meApi.abilities()
  useAbilityStore().setAbilities(toAbilities(dto))
}
