// Page de statistiques globales

import { useEffect, useMemo } from 'react'
import { useGamesStore } from '@/store/useGamesStore'
import type { Game } from '@/types'

type StatRow = { label: string; w: number; l: number; t: number; wr: number }

// Construit un tableau de stats à partir d'une fonction qui extrait des labels
function buildStats(games: Game[], extractor: (g: Game) => string | string[] | null | undefined): StatRow[] {
  const m: Record<string, { w: number; l: number }> = {}
  games.forEach((g) => {
    const vals = extractor(g)
    const arr = Array.isArray(vals) ? vals : [vals]
    arr.filter((v): v is string => !!v).forEach((v) => {
      if (!m[v]) m[v] = { w: 0, l: 0 }
      if (g.result === 'WIN') m[v].w++
      else m[v].l++
    })
  })
  return Object.entries(m).map(([k, v]) => ({
    label: k,
    ...v,
    t: v.w + v.l,
    wr: Math.round((v.w / (v.w + v.l)) * 100),
  }))
}

function StatTable({ rows, emptyMsg }: { rows: StatRow[]; emptyMsg?: string }) {
  if (!rows.length) return <div className="text-xs text-text3 py-3 text-center">{emptyMsg || 'Pas encore de données.'}</div>
  return (
    <div className="space-y-1">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-bg3">
          <div className="flex-1 text-sm truncate font-medium">{r.label}</div>
          <div className="text-xs text-text2 w-10 text-right">{r.t} pts</div>
          <div className="text-xs text-win w-6 text-right">{r.w}V</div>
          <div className="text-xs text-loss w-6 text-right">{r.l}D</div>
          <div className="flex items-center gap-1.5 w-20">
            <div className="flex-1 h-1 rounded bg-border2 overflow-hidden">
              <div className={`h-full ${r.wr >= 50 ? 'bg-win' : 'bg-loss'}`} style={{ width: `${r.wr}%` }} />
            </div>
            <span className={`text-[11px] font-bold w-8 text-right ${r.wr >= 60 ? 'text-win' : r.wr < 40 ? 'text-loss' : 'text-text2'}`}>{r.wr}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Section({ title, rows, emptyMsg, limit }: { title: string; rows: StatRow[]; emptyMsg?: string; limit?: number }) {
  const sliced = limit ? rows.slice(0, limit) : rows
  return (
    <div className="card">
      <h3 className="text-sm font-semibold mb-3 text-text1">{title}</h3>
      <StatTable rows={sliced} emptyMsg={emptyMsg} />
    </div>
  )
}

export function StatsPage() {
  const { games, loaded, fetchGames } = useGamesStore()

  useEffect(() => {
    if (!loaded) fetchGames()
  }, [loaded])

  const data = useMemo(() => {
    if (!games.length) return null
    const total = games.length
    const wins = games.filter((g) => g.result === 'WIN').length
    const winrate = Math.round((wins / total) * 100)

    return {
      total,
      wins,
      losses: total - wins,
      winrate,
      duos: buildStats(games, (g) => {
        const m = g.myPlayed.filter(Boolean).sort()
        return m.length >= 2 ? m.join(' + ') : null
      }).sort((a, b) => b.t - a.t),
      myLeads: buildStats(games, (g) => {
        const m = g.myLeads.filter(Boolean).sort()
        return m.length >= 2 ? m.join(' + ') : null
      }).sort((a, b) => b.t - a.t),
      advLeads: buildStats(games, (g) => {
        const m = g.advLeads.filter(Boolean).sort()
        return m.length >= 2 ? m.join(' + ') : null
      }).sort((a, b) => b.t - a.t),
      myPokemons: buildStats(games, (g) => g.myPlayed).sort((a, b) => b.t - a.t),
      advPokemons: buildStats(games, (g) => g.advTeam).sort((a, b) => b.l - a.l || a.wr - b.wr),
      archetypes: buildStats(games, (g) => g.archetype).sort((a, b) => b.t - a.t),
      mentals: buildStats(games, (g) => g.mental),
      speeds: buildStats(games, (g) => g.speed),
      lucks: buildStats(games, (g) => g.luck),
      tags: buildStats(games, (g) => g.tags).sort((a, b) => b.t - a.t),
    }
  }, [games])

  if (!loaded) {
    return <div className="text-center py-12 text-text2">Chargement…</div>
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-text2">
        Pas encore de données. Joue quelques parties pour voir tes stats.
      </div>
    )
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <p className="text-sm text-text2 mt-1">Analyse de tes patterns de jeu</p>
      </header>

      {/* Overview */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-bg2 border border-border1 rounded-lg px-3 py-2.5 text-center">
          <div className="text-[10px] text-text2 uppercase tracking-wider mb-1">Total</div>
          <div className="text-xl font-bold text-accent2">{data.total}</div>
        </div>
        <div className="bg-bg2 border border-border1 rounded-lg px-3 py-2.5 text-center">
          <div className="text-[10px] text-text2 uppercase tracking-wider mb-1">Victoires</div>
          <div className="text-xl font-bold text-win">{data.wins}</div>
        </div>
        <div className="bg-bg2 border border-border1 rounded-lg px-3 py-2.5 text-center">
          <div className="text-[10px] text-text2 uppercase tracking-wider mb-1">Défaites</div>
          <div className="text-xl font-bold text-loss">{data.losses}</div>
        </div>
        <div className="bg-bg2 border border-border1 rounded-lg px-3 py-2.5 text-center">
          <div className="text-[10px] text-text2 uppercase tracking-wider mb-1">Winrate</div>
          <div className={`text-xl font-bold ${data.winrate >= 50 ? 'text-win' : 'text-loss'}`}>{data.winrate}%</div>
        </div>
      </div>

      <div className="space-y-3">
        <Section title="Mes duos les plus joués" rows={data.duos} limit={10} />
        <Section title="Mes leads" rows={data.myLeads} limit={10} />
        <Section title="Leads adverses rencontrés" rows={data.advLeads} limit={10} />
        <Section title="Mes Pokémon — winrate individuel" rows={data.myPokemons} limit={15} />
        <Section title="Pokémon adverses rencontrés" rows={data.advPokemons} limit={15} />
        <Section title="Par archétype adverse" rows={data.archetypes} emptyMsg="Indique l'archétype dans le formulaire pour voir cette stat" />
        <Section title="Par état mental" rows={data.mentals} emptyMsg="Indique ton mental dans le formulaire pour voir cette stat" />
        <Section title="Speed control" rows={data.speeds} emptyMsg="Indique le speed control dans le formulaire pour voir cette stat" />
        <Section title="Luck" rows={data.lucks} emptyMsg="Indique la luck dans le formulaire pour voir cette stat" />
        {data.tags.length > 0 && <Section title="Par tag" rows={data.tags} />}
      </div>
    </div>
  )
}
