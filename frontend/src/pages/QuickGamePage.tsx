// Saisie rapide : résultat + 4 Pokémon adverses + enregistrer

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGamesStore } from '@/store/useGamesStore'
import { Autocomplete } from '@/components/Autocomplete'
import { POKEMON_LIST } from '@/data/pokemon'
import { ApiError } from '@/lib/api'
import type { GameResult } from '@/types'

export function QuickGamePage() {
  const navigate = useNavigate()
  const addGame = useGamesStore((s) => s.addGame)

  const [result, setResult] = useState<GameResult | null>(null)
  const [advTeam, setAdvTeam] = useState(['', '', '', ''])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!result) { setError('Choisis Victoire ou Défaite'); return }
    setSubmitting(true)
    try {
      const game = await addGame({
        result,
        advTeam: advTeam.map((v) => v.trim()),
      })
      navigate(`/games/${game.id}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Saisie rapide ⚡</h1>
        <p className="text-sm text-text2 mt-1">Note ta partie en 30 secondes. Tu pourras compléter les détails plus tard.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card">
          <label className="label">Résultat</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`py-4 border rounded-lg text-lg font-semibold transition ${
                result === 'WIN' ? 'bg-winBg text-win border-win' : 'bg-bg3 text-text2 border-border2 hover:text-text1'
              }`}
              onClick={() => setResult('WIN')}
            >Victoire 🏆</button>
            <button
              type="button"
              className={`py-4 border rounded-lg text-lg font-semibold transition ${
                result === 'LOSS' ? 'bg-lossBg text-loss border-loss' : 'bg-bg3 text-text2 border-border2 hover:text-text1'
              }`}
              onClick={() => setResult('LOSS')}
            >Défaite 💀</button>
          </div>
        </div>

        <div className="card">
          <label className="label">Team adverse (4 Pokémon)</label>
          <div className="grid grid-cols-2 gap-2">
            {advTeam.map((v, i) => (
              <Autocomplete
                key={i}
                value={v}
                options={POKEMON_LIST}
                placeholder={`Pokémon ${i + 1}`}
                onChange={(val) => { const c = [...advTeam]; c[i] = val; setAdvTeam(c) }}
              />
            ))}
          </div>
        </div>

        {error && <div className="bg-lossBg border border-loss/40 text-loss text-sm rounded-lg px-3 py-2">{error}</div>}

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
            {submitting ? 'Enregistrement...' : 'Enregistrer et compléter →'}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/new')}>
            Saisie détaillée
          </button>
        </div>
      </form>

      <div className="text-center text-xs text-text3 mt-6">
        💡 Tu pourras compléter les leads, notes et détails plus tard depuis la page de la partie.
      </div>
    </div>
  )
}
