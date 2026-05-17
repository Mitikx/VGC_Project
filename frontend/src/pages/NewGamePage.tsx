// Formulaire complet de création de partie

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGamesStore } from '@/store/useGamesStore'
import { Autocomplete } from '@/components/Autocomplete'
import { POKEMON_LIST } from '@/data/pokemon'
import { ApiError } from '@/lib/api'
import type { GameResult } from '@/types'

type PillVariant = 'w' | 'l' | 'a' | 'g'

function Pill({ active, onClick, children, variant }: {
  active: boolean; onClick: () => void; children: React.ReactNode; variant?: PillVariant
}) {
  const base = 'px-3 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap'
  let cls = ''
  if (active) {
    if (variant === 'w') cls = 'bg-winBg text-win border-win/40 font-semibold'
    else if (variant === 'l') cls = 'bg-lossBg text-loss border-loss/40 font-semibold'
    else if (variant === 'a') cls = 'bg-[#1e3a5f] text-accent2 border-accent/40 font-semibold'
    else if (variant === 'g') cls = 'bg-[#3a2a1f] text-orange-300 border-orange-500/40 font-semibold'
    else cls = 'bg-bg4 text-text1 border-border2 font-semibold'
  } else {
    cls = 'bg-transparent text-text2 border-border1 hover:text-text1'
  }
  return <button type="button" className={`${base} ${cls}`} onClick={onClick}>{children}</button>
}

export function NewGamePage() {
  const navigate = useNavigate()
  const addGame = useGamesStore((s) => s.addGame)

  const [result, setResult] = useState<GameResult | null>(null)
  const [advTeam, setAdvTeam] = useState(['', '', '', ''])
  const [advLeads, setAdvLeads] = useState(['', ''])
  const [myLeads, setMyLeads] = useState(['', ''])
  const [myPlayed, setMyPlayed] = useState(['', ''])
  const [archetype, setArchetype] = useState<string | null>(null)
  const [turn, setTurn] = useState<string | null>(null)
  const [speed, setSpeed] = useState<string | null>(null)
  const [luck, setLuck] = useState<string | null>(null)
  const [mental, setMental] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [noteKey, setNoteKey] = useState('')
  const [noteGood, setNoteGood] = useState('')
  const [noteBad, setNoteBad] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addTag = () => {
    const v = tagInput.trim().replace(',', '')
    if (v && !tags.includes(v)) setTags([...tags, v])
    setTagInput('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!result) { setError('Choisis Victoire ou Défaite'); return }
    setSubmitting(true)
    try {
      await addGame({
        result,
        advTeam: advTeam.map((v) => v.trim()),
        advLeads: advLeads.map((v) => v.trim()),
        myLeads: myLeads.map((v) => v.trim()),
        myPlayed: myPlayed.map((v) => v.trim()),
        archetype, turn, speed, luck, mental,
        tags,
        noteKey: noteKey.trim(),
        noteGood: noteGood.trim(),
        noteBad: noteBad.trim(),
      })
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError('Erreur inconnue')
      setSubmitting(false)
    }
  }

  const updateArray = (setter: (v: string[]) => void, arr: string[], i: number, v: string) => {
    const copy = [...arr]; copy[i] = v; setter(copy)
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Nouvelle partie</h1>
        <p className="text-sm text-text2 mt-1">Note rapidement ta partie pour analyser tes patterns plus tard.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="card">
          <label className="label">Résultat</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`py-3.5 border rounded-lg text-base font-semibold transition ${
                result === 'WIN' ? 'bg-winBg text-win border-win' : 'bg-bg3 text-text2 border-border2 hover:text-text1'
              }`}
              onClick={() => setResult('WIN')}
            >Victoire</button>
            <button
              type="button"
              className={`py-3.5 border rounded-lg text-base font-semibold transition ${
                result === 'LOSS' ? 'bg-lossBg text-loss border-loss' : 'bg-bg3 text-text2 border-border2 hover:text-text1'
              }`}
              onClick={() => setResult('LOSS')}
            >Défaite</button>
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="label">Team adverse (4 Pokémon)</label>
            <div className="grid grid-cols-2 gap-2">
              {advTeam.map((v, i) => (
                <Autocomplete key={i} value={v} options={POKEMON_LIST} placeholder={`Pokémon ${i + 1}`}
                  onChange={(val) => updateArray(setAdvTeam, advTeam, i, val)} />
              ))}
            </div>
          </div>
          <div>
            <label className="label">Lead adverse</label>
            <div className="grid grid-cols-2 gap-2">
              {advLeads.map((v, i) => (
                <Autocomplete key={i} value={v} options={POKEMON_LIST} placeholder={`Lead ${i + 1}`}
                  onChange={(val) => updateArray(setAdvLeads, advLeads, i, val)} />
              ))}
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="label">Mes leads</label>
            <div className="grid grid-cols-2 gap-2">
              {myLeads.map((v, i) => (
                <Autocomplete key={i} value={v} options={POKEMON_LIST} placeholder={`Mon lead ${i + 1}`}
                  onChange={(val) => updateArray(setMyLeads, myLeads, i, val)} />
              ))}
            </div>
          </div>
          <div>
            <label className="label">Mes Pokémon joués</label>
            <div className="grid grid-cols-2 gap-2">
              {myPlayed.map((v, i) => (
                <Autocomplete key={i} value={v} options={POKEMON_LIST} placeholder={`Pokémon ${i + 1}`}
                  onChange={(val) => updateArray(setMyPlayed, myPlayed, i, val)} />
              ))}
            </div>
          </div>
        </div>

        <div className="card space-y-3">
          <label className="label">Tags</label>
          <div className="flex flex-wrap gap-1.5 items-center p-2 bg-bg3 border border-border2 rounded-lg min-h-[40px]">
            {tags.map((t) => (
              <span key={t} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-bg4 text-text1 border border-border2">
                #{t}
                <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} className="text-text3 hover:text-loss ml-1">×</button>
              </span>
            ))}
            <input
              className="bg-transparent border-none outline-none text-sm flex-1 min-w-[100px] text-text1"
              placeholder="Ajouter un tag (Entrée)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
            />
          </div>
        </div>

        <div className="card">
          <button
            type="button"
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="flex items-center gap-2 text-sm text-text2 hover:text-text1 w-full"
          >
            <span className={`text-[10px] transition-transform ${detailsOpen ? 'rotate-90' : ''}`}>▶</span>
            <span>{detailsOpen ? 'Masquer les détails' : 'Ajouter des détails (archétype, mental...)'}</span>
          </button>

          {detailsOpen && (
            <div className="space-y-4 mt-4 pt-4 border-t border-border1">
              <div>
                <label className="label">Archétype adverse</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Hyper Offence', 'Bulky Offence', 'Trick Room', 'Stall', 'Weather', 'Autre'].map((a) => (
                    <Pill key={a} active={archetype === a} onClick={() => setArchetype(archetype === a ? null : a)}>{a}</Pill>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Tour décisif</label>
                <div className="flex flex-wrap gap-1.5">
                  {['T1', 'T2', 'T3+'].map((t) => (
                    <Pill key={t} active={turn === t} onClick={() => setTurn(turn === t ? null : t)}>{t}</Pill>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Speed control</label>
                <div className="flex flex-wrap gap-1.5">
                  <Pill active={speed === 'Oui'} onClick={() => setSpeed(speed === 'Oui' ? null : 'Oui')} variant="w">J'avais le contrôle</Pill>
                  <Pill active={speed === 'Non'} onClick={() => setSpeed(speed === 'Non' ? null : 'Non')} variant="l">Adversaire</Pill>
                  <Pill active={speed === 'Neutre'} onClick={() => setSpeed(speed === 'Neutre' ? null : 'Neutre')}>Neutre</Pill>
                </div>
              </div>
              <div>
                <label className="label">Luck</label>
                <div className="flex flex-wrap gap-1.5">
                  <Pill active={luck === 'Bon luck'} onClick={() => setLuck(luck === 'Bon luck' ? null : 'Bon luck')} variant="w">Bon luck</Pill>
                  <Pill active={luck === 'Neutre'} onClick={() => setLuck(luck === 'Neutre' ? null : 'Neutre')}>Neutre</Pill>
                  <Pill active={luck === 'Malchance'} onClick={() => setLuck(luck === 'Malchance' ? null : 'Malchance')} variant="l">Malchance</Pill>
                </div>
              </div>
              <div>
                <label className="label">État mental</label>
                <div className="flex flex-wrap gap-1.5">
                  <Pill active={mental === 'Focus'} onClick={() => setMental(mental === 'Focus' ? null : 'Focus')} variant="w">Focus</Pill>
                  <Pill active={mental === 'Neutre'} onClick={() => setMental(mental === 'Neutre' ? null : 'Neutre')}>Neutre</Pill>
                  <Pill active={mental === 'Fatigué'} onClick={() => setMental(mental === 'Fatigué' ? null : 'Fatigué')} variant="g">Fatigué</Pill>
                  <Pill active={mental === 'Tilté'} onClick={() => setMental(mental === 'Tilté' ? null : 'Tilté')} variant="l">Tilté</Pill>
                </div>
              </div>
              <div>
                <label className="label">Moment clé</label>
                <textarea className="input min-h-[60px] resize-y" placeholder="Le move qui a tout changé..."
                  value={noteKey} onChange={(e) => setNoteKey(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <div>
            <label className="label">Ce que j'ai bien fait</label>
            <textarea className="input min-h-[60px] resize-y" placeholder="Bon lead, bon switch, bonne lecture..."
              value={noteGood} onChange={(e) => setNoteGood(e.target.value)} />
          </div>
          <div>
            <label className="label">Ce que j'ai mal fait</label>
            <textarea className="input min-h-[60px] resize-y" placeholder="Mauvais target, pas anticipé..."
              value={noteBad} onChange={(e) => setNoteBad(e.target.value)} />
          </div>
        </div>

        {error && (
          <div className="bg-lossBg border border-loss/40 text-loss text-sm rounded-lg px-3 py-2">{error}</div>
        )}

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
            {submitting ? 'Enregistrement...' : 'Enregistrer la partie'}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/')}>Annuler</button>
        </div>
      </form>
    </div>
  )
}
