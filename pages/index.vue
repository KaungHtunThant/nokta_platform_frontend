<script setup lang="ts">
// Landing placeholder. Real screens are config-driven; dynamic nav arrives in Phase 3.
import { useAuthStore } from '~/stores/useAuthStore'
import { useAuth } from '~/composables/useAuth'

const auth = useAuthStore()
const { logout } = useAuth()
const router = useRouter()

async function onLogout(): Promise<void> {
  await logout()
  await router.push('/login')
}
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <h1>Nokta Platform</h1>
    <p>Configurable CRM + EMR — screens render from tenant configuration.</p>
    <p v-if="auth.user">
      Signed in as <strong>{{ auth.user.email }}</strong> (tenant {{ auth.tenantId }})
    </p>
    <p>
      <NuxtLink to="/deals">Deals →</NuxtLink>
      ·
      <a href="#" @click.prevent="onLogout">Log out</a>
    </p>
  </main>
</template>
