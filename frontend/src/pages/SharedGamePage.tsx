// Page publique d'une partie partagée via lien

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, ApiError } from '@/lib/api'
import type { SharedGameResponse } from '@/types'

export function SharedGamePage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<SharedGameResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    api.public.sharedGame(token)
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erreur'))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Link to="/" className="text-xl font-bold mb-6 inline-block">
          VGC <span className="text-accent2">Pro</span>
        </Link>

        {loading ? (
          <div className="text-center py-12 text-text2">Chargement…</div>
        ) : error || !data ? (
          <div className="card text-center py-12">
            <h2 className="text-lg font-semibold mb-2">Partie introuvable</h2>
            <p className="text-text2 text-sm mb-4">{error || 'Le lien est invalide ou le partage a été révoqué.'}</p>
            <Link to="/" className="text-accent2 hover:underline text-sm">Retour à l'accueil</Link>
          </div>
        ) : (
          <SharedGameDetail data={data} />
        )}
      </div>
    </div>
  )
}

function SharedGameDetail({ data }: { data: SharedGameResponse }) {
  const { game, username } = data
  const isWin = game.result === 'WIN'

  return (
    <>
      <p className="text-sm text-text2 mb-2">
        Partie de <Link to={`/u/${username}`} className="text-accent2 hover:underline font-semibold">@{username}</Link>
      </p>

      <div className={`card ${isWin ? 'border-l-4 border-l-win' : 'border-l-4 border-l-loss'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-text2">
            {new Date(game.playedAt).toLocaleString('fr-FR', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${isWin ? 'bg-winBg text-win' : 'bg-lossBg text-loss'}`}>
            {isWin ? 'Victoire' : 'Défaite'}
          </span>
        </div>

        {game.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-4">
            {game.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded bg-bg3 text-text2 border border-border1">#{t}</span>
            ))}
          </div>
        )}

        {game.advTeam.filter(Boolean).length > 0 && <Section label="Team adverse" items={game.advTeam} />}
        {game.advLeads.filter(Boolean).length > 0 && <Section label="Lead adverse" items={game.advLeads} variant="accent" />}
        {game.myPlayed.filter(Boolean).length > 0 && <Section label="Pokémon joués" items={game.myPlayed} variant="win" />}

        {(game.archetype || game.turn || game.mental) && (
          <div className="flex gap-1.5 flex-wrap mt-3">
            {game.archetype && <Meta label={game.archetype} />}
            {game.turn && <Meta label={game.turn} />}
            {game.mental && <Meta label={game.mental} />}
          </div>
        )}

        {(game.noteKey || game.noteGood || game.noteBad) && (
          <div className="bg-bg3 border border-border1 rounded-lg p-3 mt-4 space-y-3">
            {game.noteKey && <Note label="Moment clé" text={game.noteKey} color="text-text1" />}
            {game.noteGood && <Note label="Bien fait" text={game.noteGood} color="text-win" />}
            {game.noteBad && <Note label="À améliorer" text={game.noteBad} color="text-loss" />}
          </div>
        )}
      </div>
    </>
  )
}

function Section({ label, items, variant }: { label: string; items: string[]; variant?: 'accent' | 'win' }) {
  const color = variant === 'accent' ? 'bg-[#1e3a5f] text-accent2 border-accent/40'
    : variant === 'win' ? 'bg-winBg text-win border-win/40'
    : 'bg-bg3 text-text2 border-border2'
  return (
    <>
      <div className="text-[10px] font-semibold text-text2 mb-1.5 uppercase tracking-wider mt-3">{label}</div>
      <div className="flex gap-1.5 flex-wrap">
        {items.filter(Boolean).map((p, i) => (
          <span key={i} className={`text-xs px-2.5 py-1 rounded-full border ${color}`}>{p}</span>
        ))}
      </div>
    </>
  )
}

function Meta({ label }: { label: string }) {
  return <span className="text-[11px] px-2 py-0.5 rounded bg-bg3 text-text3 border border-border1">{label}</span>
}

function Note({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-text3 mb-1">{label}</div>
      <div className={`text-sm leading-relaxed whitespace-pre-wrap ${color}`}>{text}</div>
    </div>
  )
}
