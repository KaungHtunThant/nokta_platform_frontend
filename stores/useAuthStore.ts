// MODEL layer — pure typed state for the authenticated session (token + identity + active tenant).
// No async/API/localStorage here: a composable logs in (API), persists the token, and assigns here.
import { defineStore } from 'pinia'

export interface AuthUser {
  id: number
  email: string
  name?: string
}

interface State {
  token: string | null
  user: AuthUser | null
  tenantId: number | null
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({ token: null, user: null, tenantId: null }),
  getters: {
    isAuthenticated: (s): boolean => s.token !== null,
  },
  actions: {
    setSession(payload: { token: string, user: AuthUser, tenantId: number }): void {
      this.token = payload.token
      this.user = payload.user
      this.tenantId = payload.tenantId
    },
    setToken(token: string | null): void {
      this.token = token
    },
    setUser(user: AuthUser, tenantId: number): void {
      this.user = user
      this.tenantId = tenantId
    },
    clear(): void {
      this.token = null
      this.user = null
      this.tenantId = null
    },
  },
})
