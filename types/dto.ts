// Raw API response shapes (DTOs). These mirror the backend's typed DTOs (spatie/laravel-data)
// and are the ONLY shape returned by lib/api. They are mapped into per-util Models before
// reaching any Pinia store — a DTO is never stored directly.

export interface RecordDto {
  id: number
  entity_type: string
  label?: string | null
  stage_id: number | null
  owner_id: number | null
  status: string | null
  data: Record<string, unknown>
  created_at: string
  updated_at: string
}

// A lightweight record reference: relation-picker options + related-record lists (Phase 6).
export interface RecordRefDto {
  id: number
  entity_type: string | null
  label: string
}

export interface StageAccessDto {
  can_move_from: boolean
  can_move_to: boolean
  can_view: boolean
}

export interface FieldAccessDto {
  can_read: boolean
  can_update: boolean
  ui_visible: boolean
}

export interface AbilitiesDto {
  op: string[]
  ui: string[]
  // Capability matrices — only EXPLICITLY configured entries; a missing stage/field means "open".
  stages: Record<string, StageAccessDto> // keyed by stage id (string in JSON)
  fields: Record<string, FieldAccessDto> // keyed by field key
}

export interface PipelineDto {
  id: number
  key: string
  label: string
  position: number
}

export interface StageDto {
  id: number
  key: string
  label: string
  color: string | null
  position: number
  is_initial: boolean
  is_won: boolean
  is_lost: boolean
}

export interface BoardColumnDto {
  stage: StageDto
  records: RecordDto[]
  meta: { total: number, per_page: number, current_page: number, last_page: number }
}

export interface BoardDto {
  pipeline: PipelineDto
  columns: BoardColumnDto[]
}

export interface AuthUserDto {
  id: number
  email: string
  name?: string
}

export interface LoginResponseDto {
  token: string
  tenant_id: number
  user: AuthUserDto
}

export interface MeDto {
  user: { id: number, name: string, email: string }
  tenant_id: number
}

export interface TenantDto {
  id: number
  slug: string
  name: Record<string, string>
}

export interface LayoutVersionDto {
  version: number
  schema_version: number
  note: string | null
  created_by: number | null
  created_at: string | null
}
