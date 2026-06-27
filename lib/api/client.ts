// API client layer — HTTP + endpoint mapping only. Returns typed DTOs.
// NO business logic here, and NO mapping to Models (utils do that).
// Views and stores must NOT import this module (enforced by eslint.config.mjs).
import type { RecordDto, AbilitiesDto } from '~/types/dto'
import type { EntitySchemaDto, LayoutDto } from '~/types/schema'

function base(): string {
  return useRuntimeConfig().public.apiBase
}

type FetchOptions = Parameters<typeof $fetch>[1]

async function request<T>(path: string, init?: FetchOptions): Promise<T> {
  return await $fetch<T>(`${base()}${path}`, init)
}

export const recordsApi = {
  list: (entityType: string) =>
    request<{ data: RecordDto[] }>(`/entity-types/${encodeURIComponent(entityType)}/records`),
  get: (id: number) => request<RecordDto>(`/records/${id}`),
  create: (entityType: string, payload: { status?: string, data: Record<string, unknown> }) =>
    request<RecordDto>(`/entity-types/${encodeURIComponent(entityType)}/records`, { method: 'POST', body: payload }),
  update: (id: number, payload: { status?: string, data: Record<string, unknown> }) =>
    request<RecordDto>(`/records/${id}`, { method: 'PUT', body: payload }),
}

export const schemaApi = {
  get: (entityType: string) =>
    request<EntitySchemaDto>(`/entity-types/${encodeURIComponent(entityType)}/schema`),
}

export const layoutApi = {
  get: (surface: string, key: string) =>
    request<LayoutDto>(`/layouts/${encodeURIComponent(surface)}/${encodeURIComponent(key)}`),
}

export const meApi = {
  abilities: () => request<AbilitiesDto>('/me/abilities'),
}
