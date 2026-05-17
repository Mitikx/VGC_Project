// Page d'édition de l'équipe

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeamStore } from '@/store/useTeamStore'
import { Autocomplete } from '@/components/Autocomplete'
import { POKEMON_LIST } from '@/data/pokemon'
import { ApiError } from '@/lib/api'

const COLORS = ['#3b82f6', '#22c55e', '#ec4899', '#a3e635', '#f97316', '#a78bfa']

export function TeamPage() {
  const navigate = useNavigate()
  const { team, fetchTeam, updateTeam } = useTeamStore()
  const [edits, setEdits] = useState<string[]>(['', '', '', '', '', ''])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!team) fetchTeam()
  }, [team])

  useEffect(() => {
    if (team) setEdits([...team.pokemon])
  }, [team])

  const handleSave = async () => {
    setError(null)
    setSuccess(false)
    // On garde la valeur précédente si l'utilisateur a vidé un champ
    const next = edits.map((v, i) => v.trim() || team!.pokemon[i])
    setSaving(true)
    try {
      await updateTeam(next)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError('Erreur inconnue')
    } finally {
      setSaving(false)
    }
  }

  if (!team) {
    return <div className="text-center py-12 text-text2">Chargement de ton équipe…</div>
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Mon équipe</h1>
        <p className="text-sm text-text2 mt-1">Les 6 Pokémon que tu joues actuellement en VGC.</p>
      </header>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: COLORS[i] }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <Autocomplete
                  value={edits[i]}
                  options={POKEMON_LIST}
                  placeholder={`Pokémon ${i + 1}`}
                  onChange={(v) => { const c = [...edits]; c[i] = v; setEdits(c) }}
                />
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-lossBg border border-loss/40 text-loss text-sm rounded-lg px-3 py-2 mb-3">{error}</div>
        )}
        {success && (
          <div className="bg-winBg border border-win/40 text-win text-sm rounded-lg px-3 py-2 mb-3">✓ Équipe enregistrée</div>
        )}

        <div className="flex gap-2">
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button onClick={() => navigate('/')} className="btn">Retour</button>
        </div>
      </div>

      <div className="mt-6 text-xs text-text3 text-center">
        💡 Ton équipe est utilisée dans les stats pour suivre ta progression.
      </div>
    </div>
  )
}
