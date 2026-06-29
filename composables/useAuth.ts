// Auth use-case (Controller): orchestrates the API + session store + token persistence.
// Views call this composable; they never touch the API client or localStorage directly.
import { authApi } from '~/lib/api/client'
import { useAuthStore } from '~/stores/useAuthStore'
import { useAbilityStore } from '~/stores/useAbilityStore'
import { loadAbilities } from '~/lib/abilities/abilities'
import { loadNav } from '~/lib/nav/loadNav'
import { persistToken, clearToken } from '~/lib/auth/session'

export function useAuth() {
  const store = useAuthStore()

  async function login(input: { email: string, password: string, tenantId: number }): Promise<void> {
    const res = await authApi.login({ email: input.email, password: input.password, tenant_id: input.tenantId })
    store.setSession({ token: res.token, tenantId: res.tenant_id, user: res.user })
    persistToken(res.token)
    await loadAbilities() // resolve abilities for the tenant before the app mounts dynamic nav
    await loadNav() // cache the resolved nav layout for dynamic routing + the menu
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    }
    catch {
      // best-effort server-side revoke; clear locally regardless
    }
    store.clear()
    useAbilityStore().clear()
    clearToken()
  }

  return { login, logout }
}
