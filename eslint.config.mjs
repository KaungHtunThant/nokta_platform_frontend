// Flat ESLint config. Encodes the MVC layer BOUNDARIES from TECHNICAL-STRUCTURE Part B:
//  - Views (*.vue) may NOT call the API client directly (logic belongs in *.utils.ts).
//  - Pinia stores may NOT import the API client or util/controller modules (pure state only).
//  - Design modules hold animation/style logic only.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.vue'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['**/lib/api/*', '@/lib/api/*'],
            message: 'Views must not call the API directly — use the component’s *.utils.ts (Controller).' },
        ],
      }],
    },
  },
  {
    files: ['stores/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['**/lib/api/*', '@/lib/api/*'],
            message: 'Stores are pure state (Model) — no API calls. Utils fetch + map, then assign.' },
          { group: ['**/*.utils', '**/*.utils.ts'],
            message: 'Stores must not depend on controller utils.' },
        ],
      }],
    },
  },
)
