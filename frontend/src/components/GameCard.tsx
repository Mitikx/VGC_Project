// Affiche une partie avec ses détails

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
  if (game.speed) metas.push(`Speed: ${game.speed}`)
  if (game.luck && game.luck !== 'Neutre') metas.push(game.luck)
  if (game.mental) metas.push(game.mental)

  return (
    <div className={`bg-bg2 border border-border1 rounded-xl p-4 ${isWin ? 'border-l-4 border-l-win' : 'border-l-4 border-l-loss'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-text2">
            {new Date(game.playedAt).toLocaleString('fr-FR', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isWin ? 'bg-winBg text-win border border-win/40' : 'bg-lossBg text-loss border border-loss/40'
          }`}>
            {isWin ? 'Victoire' : 'Défaite'}
          </span>
          {onDelete && (
            <button
              className="text-text3 hover:text-loss hover:bg-lossBg w-7 h-7 rounded-md flex items-center justify-center text-sm transition"
              onClick={() => { if (confirm('Supprimer cette partie ?')) onDelete(game.id) }}
              aria-label="Supprimer"
            >✕</button>
          )}
        </div>
      </div>

      {game.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          {game.tags.map((t) => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-bg3 text-text2 border border-border1">#{t}</span>
          ))}
        </div>
      )}

      <div className="text-[10px] font-semibold text-text2 mb-1.5 uppercase tracking-wider">Team adverse</div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {game.advTeam.filter(Boolean).length > 0
          ? game.advTeam.filter(Boolean).map((p, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-bg3 border border-border2 text-text2">{p}</span>
            ))
          : <span className="text-xs text-text3">—</span>
        }
      </div>

      {game.advLeads.filter(Boolean).length > 0 && (
        <>
          <div className="text-[10px] font-semibold text-text2 mb-1.5 uppercase tracking-wider">Lead adverse</div>
          <div className="flex gap-1.5 flex-wrap mb-3">
            {game.advLeads.filter(Boolean).map((p, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[#1e3a5f] text-accent2 border border-accent/40">{p}</span>
            ))}
          </div>
        </>
      )}

      {game.myPlayed.filter(Boolean).length > 0 && (
        <>
          <div className="text-[10px] font-semibold text-text2 mb-1.5 uppercase tracking-wider">Mes Pokémon joués</div>
          <div className="flex gap-1.5 flex-wrap mb-3">
            {game.myPlayed.filter(Boolean).map((p, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-winBg text-win border border-win/40">{p}</span>
            ))}
          </div>
        </>
      )}

      {metas.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-2">
          {metas.map((m) => (
            <span key={m} className="text-[11px] px-2 py-0.5 rounded bg-bg3 text-text3 border border-border1">{m}</span>
          ))}
        </div>
      )}

      {(game.noteKey || game.noteGood || game.noteBad) && (
        <div className="bg-bg3 border border-border1 rounded-lg p-3 mt-3 space-y-2">
          {game.noteKey && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text3 mb-1">Moment clé</div>
              <div className="text-sm text-text1 leading-relaxed whitespace-pre-wrap">{game.noteKey}</div>
            </div>
          )}
          {game.noteGood && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text3 mb-1">Bien fait</div>
              <div className="text-sm text-win leading-relaxed whitespace-pre-wrap">{game.noteGood}</div>
            </div>
          )}
          {game.noteBad && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text3 mb-1">À améliorer</div>
              <div className="text-sm text-loss leading-relaxed whitespace-pre-wrap">{game.noteBad}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
