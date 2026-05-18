// Profil public d'un utilisateur

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, ApiError } from '@/lib/api'
import type { PublicUserProfile } from '@/types'

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [data, setData] = useState<PublicUserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    api.public.user(username)
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erreur'))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) return <PublicLayout><div className="text-center py-12 text-text2">Chargement…</div></PublicLayout>

  if (error || !data) {
    return (
      <PublicLayout>
        <div className="card text-center py-12">
          <h2 className="text-lg font-semibold mb-2">Profil introuvable</h2>
          <p className="text-text2 text-sm mb-4">{error || `@${username} n'existe pas ou son profil est privé.`}</p>
          <Link to="/" className="text-accent2 hover:underline text-sm">Retour à l'accueil</Link>
        </div>
      </PublicLayout>
    )
  }

  const { user, stats, recentResults } = data

  return (
    <PublicLayout>
      <div className="card">
        <h1 className="text-2xl font-bold">@{user.username}</h1>
        <p className="text-xs text-text2 mt-1">Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
        {user.bio && <p className="text-sm text-text1 mt-3 leading-relaxed whitespace-pre-wrap">{user.bio}</p>}
      </div>

      <div className="grid grid-cols-4 gap-3 my-4">
        <StatBox label="Parties" value={stats.total} color="text-accent2" />
        <StatBox label="V" value={stats.wins} color="text-win" />
        <StatBox label="D" value={stats.losses} color="text-loss" />
        <StatBox label="Winrate" value={`${stats.winrate}%`} color={stats.winrate >= 50 ? 'text-win' : 'text-loss'} />
      </div>

      {user.team.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold mb-3">Équipe actuelle</h3>
          <div className="flex flex-wrap gap-2">
            {user.team.map((p, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-bg3 border border-border2">{p}</span>
            ))}
          </div>
        </div>
      )}

      {recentResults.length > 0 && (
        <div className="card mt-4">
          <h3 className="text-sm font-semibold mb-3">Forme récente (les {recentResults.length} dernières)</h3>
          <div className="flex gap-1 flex-wrap">
            {recentResults.map((r, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center ${
                  r === 'WIN' ? 'bg-winBg text-win border border-win/40' : 'bg-lossBg text-loss border border-loss/40'
                }`}
              >
                {r === 'WIN' ? 'V' : 'D'}
              </div>
            ))}
          </div>
        </div>
      )}
    </PublicLayout>
  )
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Link to="/" className="text-xl font-bold mb-6 inline-block">
          VGC <span className="text-accent2">Pro</span>
        </Link>
        {children}
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="bg-bg2 border border-border1 rounded-lg px-3 py-2.5 text-center">
      <div className="text-[10px] text-text2 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  )
}
