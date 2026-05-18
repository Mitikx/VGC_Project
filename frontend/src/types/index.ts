// Types partagés (alignés sur le backend)

export interface User {
  id: string
  email: string
  username: string
  bio?: string
  publicProfile?: boolean
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export type GameResult = 'WIN' | 'LOSS'

export interface Game {
  id: string
  userId: string
  playedAt: string
  result: GameResult
  advTeam: string[]
  advLeads: string[]
  myLeads: string[]
  myPlayed: string[]
  archetype: string | null
  turn: string | null
  speed: string | null
  luck: string | null
  mental: string | null
  rating: number | null
  tags: string[]
  noteKey: string
  noteGood: string
  noteBad: string
  shareToken?: string | null
  createdAt: string
  updatedAt?: string
}

export interface Team {
  id: string
  userId: string
  pokemon: string[]
  updatedAt: string
}

export type CreateGameInput = {
  result: GameResult
  advTeam?: string[]
  advLeads?: string[]
  myLeads?: string[]
  myPlayed?: string[]
  archetype?: string | null
  turn?: string | null
  speed?: string | null
  luck?: string | null
  mental?: string | null
  rating?: number | null
  tags?: string[]
  noteKey?: string
  noteGood?: string
  noteBad?: string
}

export interface PublicUserProfile {
  user: {
    username: string
    bio: string
    createdAt: string
    team: string[]
  }
  stats: {
    total: number
    wins: number
    losses: number
    winrate: number
  }
  recentResults: GameResult[]
}

export interface SharedGameResponse {
  game: Game
  username: string
}
