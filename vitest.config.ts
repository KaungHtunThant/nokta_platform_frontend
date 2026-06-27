import { defineConfig } from 'vitest/config'

// Logic lives in pure TS (*.utils.ts / *.model.ts), so it is unit-testable without mounting components.
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['**/*.spec.ts'],
    globals: true,
  },
})
