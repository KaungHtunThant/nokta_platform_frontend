import { defineConfig } from 'vitest/config'

// Logic lives in pure TS (*.utils.ts / *.model.ts), so it is unit-testable without mounting components.
// The `~` / `@` aliases mirror Nuxt's so utils that import runtime modules (stores, registries) resolve.
const root = new URL('.', import.meta.url).pathname

export default defineConfig({
  resolve: {
    alias: {
      '~': root,
      '@': root,
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['**/*.spec.ts'],
    globals: true,
  },
})
