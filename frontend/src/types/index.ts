// Types partagés entre frontend et backend
// Idéalement on les générerait depuis Prisma, mais pour rester simple
// on les duplique en s'assurant qu'ils correspondent au backend.

export interface User {
  id: string
  email: string
  username: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiError {
  error: string
  details?: Record<string, string[]>
}
