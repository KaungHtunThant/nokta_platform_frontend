// Global route guard: unauthenticated users are sent to /login; authenticated users never see it.
// The token itself is attached to API calls in lib/api/client.ts (from the session store).
import { useAuthStore } from '~/stores/useAuthStore'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
