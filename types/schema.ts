// Schema + layout DTOs (mirror the backend flat resources) and the layout node type.

export interface FieldOptionDto {
  key: string
  label: string
  color?: string | null
}

export interface FieldDto {
  key: string
  type: string
  label: string
  help?: string | null
  validation: Record<string, unknown>
  ui: Record<string, unknown>
  default_value: unknown
  position: number
  options?: FieldOptionDto[]
}

export interface EntitySchemaDto {
  key: string
  label: string
  icon: string | null
  supports_pipeline: boolean
  fields: FieldDto[]
}

export interface LayoutNode {
  type: string
  id: string
  props?: Record<string, unknown>
  binding?: { field: string }
  permission?: { ui?: string }
  visibleWhen?: { field: string, op: string, value: unknown }
  children?: LayoutNode[]
}

export interface LayoutDto {
  surface: string
  key: string
  version: number
  schema_version: number
  schema: LayoutNode
}
