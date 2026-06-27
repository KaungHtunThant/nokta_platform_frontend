// Raw API response shapes (DTOs). These mirror the backend's typed DTOs (spatie/laravel-data)
// and are the ONLY shape returned by lib/api. They are mapped into per-util Models before
// reaching any Pinia store — a DTO is never stored directly.

export interface RecordDto {
  id: number
  entity_type: string
  stage_id: number | null
  owner_id: number | null
  data: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AbilitiesDto {
  op: string[]
  ui: string[]
}

export interface TenantDto {
  id: number
  slug: string
  name: Record<string, string>
}
