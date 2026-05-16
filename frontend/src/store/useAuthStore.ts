// Store d'authentification global
// Maintient l'utilisateur connecté et son token JWT.
// Le token est persisté dans localStorage pour rester connecté après reload.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, ApiError } from '@/lib/api'
import type { User } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  loading: boolean

  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true })
        try {
          const { user, token } = await api.auth.login({ email, password })
          set({ user, token, loading: false })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      register: async (email, username, password) => {
        set({ loading: true })
        try {
          const { user, token } = await api.auth.register({ email, username, password })
          set({ user, token, loading: false })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      logout: () => {
        set({ user: null, token: null })
      },

      // Recharge l'utilisateur depuis le serveur (utile au démarrage de l'app
      // pour vérifier que le token persisté est toujours valide).
      refreshUser: async () => {
        const { token } = get()
        if (!token) return
        try {
          const { user } = await api.auth.me(token)
          set({ user })
        } catch (err) {
          // Token invalide ou expiré → on déconnecte proprement
          if (err instanceof ApiError && err.status === 401) {
            set({ user: null, token: null })
          }
        }
      },
    }),
    {
      name: 'vgc-pro-auth',          // clé localStorage
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
)
