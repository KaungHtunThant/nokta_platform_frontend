// Raw API response shapes (DTOs). These mirror the backend's typed DTOs (spatie/laravel-data)
// and are the ONLY shape returned by lib/api. They are mapped into per-util Models before
// reaching any Pinia store — a DTO is never stored directly.

export interface RecordDto {
  id: number
  entity_type: string
  stage_id: number | null
  owner_id: number | null
  status: string | null
  data: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AbilitiesDto {
  op: string[]
  ui: string[]
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
