// Client API centralisé

import type { AuthResponse, User, Game, Team, CreateGameInput, PublicUserProfile, SharedGameResponse } from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  token?: string | null
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Impossible de joindre le serveur. Vérifie que le backend tourne.')
  }

  if (response.status === 204) return undefined as T

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data as { error?: string }).error || `Erreur ${response.status}`,
      (data as { details?: Record<string, string[]> }).details,
    )
  }

  return data as T
}

export const api = {
  auth: {
    register: (body: { email: string; username: string; password: string }) =>
      request<AuthResponse>('/api/auth/register', { method: 'POST', body }),
    login: (body: { email: string; password: string }) =>
      request<AuthResponse>('/api/auth/login', { method: 'POST', body }),
    me: (token: string) => request<{ user: User }>('/api/auth/me', { token }),
  },

  games: {
    list: (token: string) =>
      request<{ games: Game[] }>('/api/games', { token }),
    get: (token: string, id: string) =>
      request<{ game: Game }>(`/api/games/${id}`, { token }),
    create: (token: string, body: CreateGameInput) =>
      request<{ game: Game }>('/api/games', { method: 'POST', body, token }),
    update: (token: string, id: string, body: CreateGameInput) =>
      request<{ game: Game }>(`/api/games/${id}`, { method: 'PUT', body, token }),
    delete: (token: string, id: string) =>
      request<void>(`/api/games/${id}`, { method: 'DELETE', token }),
    enableShare: (token: string, id: string) =>
      request<{ game: Game; shareToken: string }>(`/api/games/${id}/share`, { method: 'POST', token }),
    disableShare: (token: string, id: string) =>
      request<{ game: Game }>(`/api/games/${id}/share`, { method: 'DELETE', token }),
  },

  team: {
    get: (token: string) => request<{ team: Team }>('/api/team', { token }),
    update: (token: string, pokemon: string[]) =>
      request<{ team: Team }>('/api/team', { method: 'PUT', body: { pokemon }, token }),
  },

  profile: {
    get: (token: string) => request<{ user: User }>('/api/profile', { token }),
    update: (token: string, body: { bio: string; publicProfile: boolean }) =>
      request<{ user: User }>('/api/profile', { method: 'PUT', body, token }),
  },

  public: {
    user: (username: string) =>
      request<PublicUserProfile>(`/api/public/users/${encodeURIComponent(username)}`),
    sharedGame: (shareToken: string) =>
      request<SharedGameResponse>(`/api/public/share/${shareToken}`),
  },

  health: () => request<{ status: string; database: string }>('/api/health'),
}
