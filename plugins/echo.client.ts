// Configures laravel-echo against Reverb for tenant-scoped realtime. Guarded: without a reverb key
// it stays disabled (no $echo provided) so the app runs fine without a broadcast server.
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { useAuthStore } from '~/stores/useAuthStore'

export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig().public
  if (!cfg.reverbKey) return

  ;(globalThis as unknown as { Pusher: typeof Pusher }).Pusher = Pusher

  const origin = cfg.apiBase.replace(/\/api\/?$/, '')

  const echo = new Echo({
    broadcaster: 'reverb',
    key: cfg.reverbKey,
    wsHost: cfg.wsHost,
    wsPort: Number(cfg.wsPort),
    wssPort: Number(cfg.wsPort),
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${origin}/broadcasting/auth`,
    auth: { headers: { Authorization: `Bearer ${useAuthStore().token ?? ''}` } },
  })

  return { provide: { echo } }
})
