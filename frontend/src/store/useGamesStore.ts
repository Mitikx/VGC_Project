// Store des parties — synchronisé avec le backend
// On stocke localement la liste des parties + on offre des actions
// qui appellent l'API et mettent à jour le state.

import { create } from 'zustand'
import { api } from '@/lib/api'
import { useAuthStore } from './useAuthStore'
import type { Game, CreateGameInput } from '@/types'

interface GamesStore {
  games: Game[]
  loading: boolean
  loaded: boolean

  fetchGames: () => Promise<void>
  addGame: (input: CreateGameInput) => Promise<Game>
  removeGame: (id: string) => Promise<void>
  reset: () => void
}

export const useGamesStore = create<GamesStore>((set, get) => ({
  games: [],
  loading: false,
  loaded: false,

  fetchGames: async () => {
    const token = useAuthStore.getState().token
    if (!token) return
    set({ loading: true })
    try {
      const { games } = await api.games.list(token)
      set({ games, loading: false, loaded: true })
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  addGame: async (input) => {
    const token = useAuthStore.getState().token
    if (!token) throw new Error('Pas de token')
    const { game } = await api.games.create(token, input)
    // On l'ajoute en tête (la liste est triée par date desc côté serveur)
    set({ games: [game, ...get().games] })
    return game
  },

  removeGame: async (id) => {
    const token = useAuthStore.getState().token
    if (!token) throw new Error('Pas de token')
    await api.games.delete(token, id)
    set({ games: get().games.filter((g) => g.id !== id) })
  },

  reset: () => set({ games: [], loaded: false }),
}))
