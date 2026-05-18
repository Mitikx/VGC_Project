// Carte d'affichage d'une partie - cliquable pour voir le détail

import { Link } from 'react-router-dom'
import type { Game } from '@/types'

interface GameCardProps {
  game: Game
  onDelete?: (id: string) => void
}

export function GameCard({ game, onDelete }: GameCardProps) {
  const isWin = game.result === 'WIN'

  const metas: string[] = []
  if (game.archetype) metas.push(game.archetype)
  if (game.turn) metas.push(game.turn)
  if (game.mental) metas.push(game.mental)

  return (
    <div className={`bg-bg2 border border-border1 rounded-xl p-4 ${isWin ? 'border-l-4 border-l-win' : 'border-l-4 border-l-loss'} hover:border-border2 transition`}>
      <div className="flex items-center justify-between mb-3">
        <Link to={`/games/${game.id}`} className="flex-1 min-w-0">
          <div className="text-xs text-text2 hover:text-text1">
            {new Date(game.playedAt).toLocaleString('fr-FR', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isWin ? 'bg-winBg text-win border border-win/40' : 'bg-lossBg text-loss border border-loss/40'
          }`}>
            {isWin ? 'Victoire' : 'Défaite'}
          </span>
          {onDelete && (
            <button
              className="text-text3 hover:text-loss hover:bg-lossBg w-7 h-7 rounded-md flex items-center justify-center text-sm transition"
              onClick={(e) => { e.preventDefault(); if (confirm('Supprimer ?')) onDelete(game.id) }}
              aria-label="Supprimer"
            >✕</button>
          )}
        </div>
      </div>

      <Link to={`/games/${game.id}`} className="block">
        {game.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {game.tags.map((t) => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-bg3 text-text2 border border-border1">#{t}</span>
            ))}
          </div>
        )}

        <div className="text-[10px] font-semibold text-text2 mb-1.5 uppercase tracking-wider">Team adverse</div>
        <div className="flex gap-1.5 flex-wrap mb-2">
          {game.advTeam.filter(Boolean).length > 0
            ? game.advTeam.filter(Boolean).map((p, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-bg3 border border-border2 text-text2">{p}</span>
              ))
            : <span className="text-xs text-text3">—</span>}
        </div>

        {game.myPlayed.filter(Boolean).length > 0 && (
          <>
            <div className="text-[10px] font-semibold text-text2 mb-1.5 uppercase tracking-wider mt-2">Mes joués</div>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {game.myPlayed.filter(Boolean).map((p, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-winBg text-win border border-win/40">{p}</span>
              ))}
            </div>
          </>
        )}

        {metas.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-2">
            {metas.map((m) => (
              <span key={m} className="text-[11px] px-2 py-0.5 rounded bg-bg3 text-text3 border border-border1">{m}</span>
            ))}
          </div>
        )}
      </Link>
    </div>
  )
}
