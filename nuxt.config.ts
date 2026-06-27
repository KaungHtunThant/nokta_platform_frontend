// Nuxt config — SPA-style configurable CRM/EMR client.
// See ../crm_emr_platform_plan/ for architecture & conventions.
export default defineNuxtConfig({
  ssr: false, // app shell SPA; screens are rendered from tenant config at runtime
  compatibilityDate: '2025-01-01',
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
  ],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  // Nuxt auto-overrides these from NUXT_PUBLIC_* env vars at runtime — no process.env needed here.
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api',
      wsHost: '127.0.0.1',
      wsPort: '8080',
      reverbKey: '', // set NUXT_PUBLIC_REVERB_KEY to enable realtime board updates
      expressWhatsappUrl: '',
    },
  },
  // i18n messages are loaded at runtime from the API (DB-backed, JSON-seeded, editable).
})
