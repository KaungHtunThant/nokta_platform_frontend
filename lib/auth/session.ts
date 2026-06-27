// Token persistence (localStorage) kept OUT of the Pinia store so the store stays pure state.
// Utils/composables/plugins read & write here; the store only holds the in-memory session.
const TOKEN_KEY = 'nokta.token'

export function persistToken(token: string): void {
  if (import.meta.client) localStorage.setItem(TOKEN_KEY, token)
}

export function readToken(): string | null {
  return import.meta.client ? localStorage.getItem(TOKEN_KEY) : null
}

export function clearToken(): void {
  if (import.meta.client) localStorage.removeItem(TOKEN_KEY)
}
