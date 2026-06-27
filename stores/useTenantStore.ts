// MODEL layer — pure typed state for the active tenant (branding, identity).
import { defineStore } from 'pinia'

export interface TenantModel {
  id: number
  slug: string
  name: string
}

interface State {
  current: TenantModel | null
}

export const useTenantStore = defineStore('tenant', {
  state: (): State => ({ current: null }),
  getters: {
    isResolved: (s): boolean => s.current !== null,
  },
  actions: {
    setTenant(tenant: TenantModel): void {
      this.current = tenant
    },
  },
})
