<script setup lang="ts">
// Login view — thin shell over the useAuth composable (orchestration) and design tokens (styling).
import { ref } from 'vue'
import { baseTokens } from '~/design/tokens'
import { useAuth } from '~/composables/useAuth'

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const tenantId = ref(1)
const error = ref('')
const submitting = ref(false)

async function onSubmit(): Promise<void> {
  error.value = ''
  submitting.value = true
  try {
    await login({ email: email.value, password: password.value, tenantId: tenantId.value })
    await router.push('/')
  }
  catch {
    error.value = 'Login failed — check your email, password, and tenant.'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <main :style="{ display: 'grid', placeItems: 'center', minHeight: '100vh', fontFamily: baseTokens.font.family }">
    <form
      :style="{ display: 'grid', gap: baseTokens.space.md, width: '320px', padding: baseTokens.space.xl, border: '1px solid #eef0f3', borderRadius: baseTokens.radius.lg }"
      @submit.prevent="onSubmit"
    >
      <h1 :style="{ margin: 0, color: baseTokens.color.primary }">Nokta Platform</h1>
      <p v-if="error" :style="{ color: baseTokens.color.danger, margin: 0 }">{{ error }}</p>

      <label :style="{ display: 'grid', gap: baseTokens.space.xs }">
        <span :style="{ fontSize: '13px', color: baseTokens.color.muted }">Email</span>
        <InputText v-model="email" type="email" required autocomplete="username" />
      </label>

      <label :style="{ display: 'grid', gap: baseTokens.space.xs }">
        <span :style="{ fontSize: '13px', color: baseTokens.color.muted }">Password</span>
        <InputText v-model="password" type="password" required autocomplete="current-password" />
      </label>

      <label :style="{ display: 'grid', gap: baseTokens.space.xs }">
        <span :style="{ fontSize: '13px', color: baseTokens.color.muted }">Tenant ID</span>
        <InputNumber v-model="tenantId" :min="1" :use-grouping="false" />
      </label>

      <Button type="submit" :label="submitting ? 'Signing in…' : 'Sign in'" :disabled="submitting" />
    </form>
  </main>
</template>
