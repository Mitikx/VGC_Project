// Page principale : liste des parties avec recherche + filtre

import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useGamesStore } from '@/store/useGamesStore'
import { GameCard } from '@/components/GameCard'

export function PartiesPage() {
  const { games, loading, loaded, fetchGames, removeGame } = useGamesStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'win' | 'loss'>('all')

  useEffect(() => {
    if (!loaded) fetchGames()
  }, [loaded])

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (filter === 'win' && g.result !== 'WIN') return false
      if (filter === 'loss' && g.result !== 'LOSS') return false
      if (!query.trim()) return true
      const q = query.toLowerCase()
      const blob = [
        ...g.advTeam, ...g.advLeads, ...g.myLeads, ...g.myPlayed,
        ...g.tags, g.noteKey, g.noteGood, g.noteBad, g.archetype, g.mental, g.luck,
      ].filter(Boolean).join(' ').toLowerCase()
      return blob.includes(q)
    })
  }, [games, query, filter])

  const wins = games.filter((g) => g.result === 'WIN').length
  const losses = games.filter((g) => g.result === 'LOSS').length
  const total = games.length
  const wr = total > 0 ? Math.round((wins / total) * 100) : 0

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes parties</h1>
          <p className="text-sm text-text2 mt-1">{total} parties enregistrées</p>
        </div>
        <Link to="/new" className="btn btn-primary">+ Nouvelle</Link>
      </header>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCell label="Parties" value={total} />
        <StatCell label="Victoires" value={wins} variant="win" />
        <StatCell label="Défaites" value={losses} variant="loss" />
        <StatCell label="Winrate" value={total > 0 ? `${wr}%` : '—'} />
      </div>

      {/* Recherche + filtres */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          className="input"
          placeholder="🔍 Rechercher dans tes parties..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-2">
          {([
            { key: 'all', label: 'Toutes' },
            { key: 'win', label: 'Victoires' },
            { key: 'loss', label: 'Défaites' },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                filter === f.key
                  ? 'bg-bg4 text-text1 border-border2 font-semibold'
                  : 'bg-transparent text-text2 border-border1 hover:text-text1'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {loading && !loaded ? (
        <div className="text-center py-12 text-text2">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12 text-text2">
          {games.length === 0
            ? <>Aucune partie pour l'instant.<br/><Link to="/new" className="text-accent2 hover:underline">Crée ta première partie</Link></>
            : 'Aucune partie ne correspond à ta recherche.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((g) => <GameCard key={g.id} game={g} onDelete={removeGame} />)}
        </div>
      )}
    </div>
  )
}

function StatCell({ label, value, variant }: { label: string; value: number | string; variant?: 'win' | 'loss' }) {
  const color = variant === 'win' ? 'text-win' : variant === 'loss' ? 'text-loss' : 'text-accent2'
  return (
    <div className="bg-bg2 border border-border1 rounded-lg px-3 py-2.5 text-center">
      <div className="text-[10px] text-text2 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  )
}
