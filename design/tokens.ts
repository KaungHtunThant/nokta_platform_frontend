// Base styles & layout authored in TypeScript (typed design tokens) — not scattered CSS/SCSS.
// PrimeVue theming is configured from these tokens; per-tenant branding overrides them at runtime.

export interface DesignTokens {
  color: Record<string, string>
  space: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>
  radius: Record<'sm' | 'md' | 'lg', string>
  font: { family: string, sizeBase: string }
}

export const baseTokens: DesignTokens = {
  color: {
    primary: '#1f3864',
    accent: '#2e74b5',
    surface: '#ffffff',
    text: '#1f2933',
    muted: '#6b7280',
    danger: '#dd3636',
  },
  space: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px' },
  radius: { sm: '4px', md: '8px', lg: '16px' },
  font: { family: 'Inter, system-ui, sans-serif', sizeBase: '14px' },
}

/** Merge a tenant's branding over the base tokens (runtime theming). */
export function resolveTokens(tenantOverrides?: Partial<DesignTokens>): DesignTokens {
  return {
    ...baseTokens,
    ...tenantOverrides,
    color: { ...baseTokens.color, ...(tenantOverrides?.color ?? {}) },
  }
}
