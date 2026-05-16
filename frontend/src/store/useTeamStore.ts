// Store de l'équipe — synchronisé avec le backend

import { create } from 'zustand'
import { api } from '@/lib/api'
import { useAuthStore } from './useAuthStore'
import type { Team } from '@/types'

interface TeamStore {
  team: Team | null
  loading: boolean

  fetchTeam: () => Promise<void>
  updateTeam: (pokemon: string[]) => Promise<void>
  reset: () => void
}

export const useTeamStore = create<TeamStore>((set) => ({
  team: null,
  loading: false,

  fetchTeam: async () => {
    const token = useAuthStore.getState().token
    if (!token) return
    set({ loading: true })
    try {
      const { team } = await api.team.get(token)
      set({ team, loading: false })
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  updateTeam: async (pokemon) => {
    const token = useAuthStore.getState().token
    if (!token) throw new Error('Pas de token')
    const { team } = await api.team.update(token, pokemon)
    set({ team })
  },

  reset: () => set({ team: null }),
}))
