// Client API centralisé
// Toute communication avec le backend passe par ce fichier.
// Avantages : 1 seul endroit pour gérer l'auth, les erreurs, les headers...
// Quand on changera l'URL ou la façon d'auth, on touchera ici seulement.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Erreur custom enrichie avec le code HTTP et les détails de validation
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

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    // Erreur réseau : le serveur est down ou inaccessible
    throw new ApiError(0, 'Impossible de joindre le serveur. Vérifie que le backend tourne.')
  }

  // Pour les 204 No Content, pas de body à parser
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

// API typée — on ajoutera des endpoints au fur et à mesure des étapes
export const api = {
  // ── Auth ────────────────────────────────────────────────────────────────
  auth: {
    register: (body: { email: string; username: string; password: string }) =>
      request<import('@/types').AuthResponse>('/api/auth/register', { method: 'POST', body }),

    login: (body: { email: string; password: string }) =>
      request<import('@/types').AuthResponse>('/api/auth/login', { method: 'POST', body }),

    me: (token: string) =>
      request<{ user: import('@/types').User }>('/api/auth/me', { token }),
  },

  // ── Health ──────────────────────────────────────────────────────────────
  health: () => request<{ status: string; database: string }>('/api/health'),
}
