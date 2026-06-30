// API client layer — HTTP + endpoint mapping only. Returns typed DTOs.
// NO business logic here, and NO mapping to Models (utils do that).
// Views and stores must NOT import this module (enforced by eslint.config.mjs).
import type { RecordDto, RecordRefDto, AbilitiesDto, LoginResponseDto, MeDto, BoardDto, LayoutVersionDto } from '~/types/dto'
import type { EntitySchemaDto, LayoutDto, LayoutNode } from '~/types/schema'
import { useAuthStore } from '~/stores/useAuthStore'

function base(): string {
  return useRuntimeConfig().public.apiBase
}

type FetchOptions = Parameters<typeof $fetch>[1]

async function request<T>(path: string, init: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = useAuthStore().token
  if (token) headers.Authorization = `Bearer ${token}`

  return await $fetch<T>(`${base()}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers as Record<string, string> | undefined) },
  })
}

function queryString(params: Record<string, string> = {}): string {
  const qs = new URLSearchParams(params).toString()
  return qs ? `?${qs}` : ''
}

export const recordsApi = {
  list: (entityType: string, params: Record<string, string> = {}) =>
    request<{ data: RecordDto[] }>(`/entity-types/${encodeURIComponent(entityType)}/records${queryString(params)}`),
  get: (id: number) => request<RecordDto>(`/records/${id}`),
  create: (entityType: string, payload: { status?: string, data: Record<string, unknown> }) =>
    request<RecordDto>(`/entity-types/${encodeURIComponent(entityType)}/records`, { method: 'POST', body: payload }),
  update: (id: number, payload: { status?: string, data: Record<string, unknown> }) =>
    request<RecordDto>(`/records/${id}`, { method: 'PUT', body: payload }),
  move: (id: number, payload: { stage_id: number, comment?: string, position?: number }) =>
    request<RecordDto>(`/records/${id}/move`, { method: 'POST', body: payload }),

  // --- Phase 6: relations ---
  // Relation-field picker: a light {id,label,entity_type} list of a target entity type.
  picker: (entityType: string, q = '') =>
    request<RecordRefDto[]>(`/entity-types/${encodeURIComponent(entityType)}/records-picker${queryString(q ? { q } : {})}`),
  // Records linked to a record (both directions), optionally narrowed to one relation key.
  related: (recordId: number, relationKey?: string) =>
    request<RecordRefDto[]>(`/records/${recordId}/links${queryString(relationKey ? { relation_key: relationKey } : {})}`),
  link: (recordId: number, payload: { to_record_id: number, relation_key: string }) =>
    request<unknown>(`/records/${recordId}/links`, { method: 'POST', body: payload }),
  unlink: (recordId: number, payload: { to_record_id: number, relation_key: string }) =>
    request<unknown>(`/records/${recordId}/links`, { method: 'DELETE', body: payload }),

  // --- Phase 7: files + locking ---
  uploadFile: (recordId: number, fieldKey: string, file: File) => {
    const form = new FormData()
    form.append('field_key', fieldKey)
    form.append('file', file)
    return request<RecordDto>(`/records/${recordId}/files`, { method: 'POST', body: form })
  },
  deleteFile: (recordId: number, mediaId: number) =>
    request<unknown>(`/records/${recordId}/files/${mediaId}`, { method: 'DELETE' }),
  lock: (recordId: number) => request<RecordDto>(`/records/${recordId}/lock`, { method: 'POST' }),
  unlock: (recordId: number) => request<RecordDto>(`/records/${recordId}/unlock`, { method: 'POST' }),
}

export const boardApi = {
  get: (entityType: string, params: { pipeline_id?: number, per_page?: number, filters?: string } = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]),
    ).toString()
    return request<BoardDto>(`/entity-types/${encodeURIComponent(entityType)}/board${qs ? `?${qs}` : ''}`)
  },
}

export const schemaApi = {
  get: (entityType: string) =>
    request<EntitySchemaDto>(`/entity-types/${encodeURIComponent(entityType)}/schema`),
}

export const layoutApi = {
  get: (surface: string, key: string) =>
    request<LayoutDto>(`/layouts/${encodeURIComponent(surface)}/${encodeURIComponent(key)}`),

  // --- Phase 5 builder ---
  versions: (surface: string, key: string) =>
    request<{ data: LayoutVersionDto[] }>(`/layouts/${encodeURIComponent(surface)}/${encodeURIComponent(key)}/versions`),
  saveVersion: (surface: string, key: string, payload: { schema: LayoutNode, note?: string }) =>
    request<LayoutVersionDto>(`/layouts/${encodeURIComponent(surface)}/${encodeURIComponent(key)}/versions`, { method: 'POST', body: payload }),
  publish: (surface: string, key: string, version: number) =>
    request<LayoutDto>(`/layouts/${encodeURIComponent(surface)}/${encodeURIComponent(key)}/publish`, { method: 'POST', body: { version } }),
  rollback: (surface: string, key: string, version: number) =>
    request<LayoutDto>(`/layouts/${encodeURIComponent(surface)}/${encodeURIComponent(key)}/rollback`, { method: 'POST', body: { version } }),
  reset: (surface: string, key: string) =>
    request<LayoutDto>(`/layouts/${encodeURIComponent(surface)}/${encodeURIComponent(key)}/reset`, { method: 'POST' }),
}

export const authApi = {
  login: (payload: { email: string, password: string, tenant_id: number }) =>
    request<LoginResponseDto>('/login', { method: 'POST', body: payload }),
  me: () => request<MeDto>('/me'),
  logout: () => request<{ message: string }>('/logout', { method: 'POST' }),
}

export const meApi = {
  abilities: () => request<AbilitiesDto>('/me/abilities'),
}
