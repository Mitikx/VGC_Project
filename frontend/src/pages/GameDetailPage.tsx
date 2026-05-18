// Page détail + édition d'une partie

import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamesStore } from '@/store/useGamesStore'
import { api, ApiError } from '@/lib/api'
import { Autocomplete } from '@/components/Autocomplete'
import { POKEMON_LIST } from '@/data/pokemon'
import type { Game, GameResult } from '@/types'

export function GameDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const { removeGame } = useGamesStore()

  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    result: 'WIN' as GameResult,
    advTeam: ['', '', '', ''],
    advLeads: ['', ''],
    myLeads: ['', ''],
    myPlayed: ['', ''],
    archetype: null as string | null,
    turn: null as string | null,
    speed: null as string | null,
    luck: null as string | null,
    mental: null as string | null,
    tags: [] as string[],
    noteKey: '',
    noteGood: '',
    noteBad: '',
  })

  useEffect(() => {
    if (!id || !token) return
    setLoading(true)
    api.games.get(token, id)
      .then(({ game }) => {
        setGame(game)
        if (game.shareToken) {
          setShareUrl(`${window.location.origin}/share/${game.shareToken}`)
        }
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erreur'))
      .finally(() => setLoading(false))
  }, [id, token])

  const startEditing = () => {
    if (!game) return
    setForm({
      result: game.result,
      advTeam: [...game.advTeam, '', '', '', ''].slice(0, 4),
      advLeads: [...game.advLeads, '', ''].slice(0, 2),
      myLeads: [...game.myLeads, '', ''].slice(0, 2),
      myPlayed: [...game.myPlayed, '', ''].slice(0, 2),
      archetype: game.archetype,
      turn: game.turn,
      speed: game.speed,
      luck: game.luck,
      mental: game.mental,
      tags: [...game.tags],
      noteKey: game.noteKey,
      noteGood: game.noteGood,
      noteBad: game.noteBad,
    })
    setEditing(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!game || !token) return
    setSaving(true)
    setError(null)
    try {
      const { game: updated } = await api.games.update(token, game.id, {
        ...form,
        advTeam: form.advTeam.map((v) => v.trim()),
        advLeads: form.advLeads.map((v) => v.trim()),
        myLeads: form.myLeads.map((v) => v.trim()),
        myPlayed: form.myPlayed.map((v) => v.trim()),
      })
      setGame(updated)
      useGamesStore.getState().reset()
      setEditing(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!game || !confirm('Supprimer cette partie ?')) return
    await removeGame(game.id)
    navigate('/')
  }

  const handleEnableShare = async () => {
    if (!game || !token) return
    try {
      const { shareToken } = await api.games.enableShare(token, game.id)
      setShareUrl(`${window.location.origin}/share/${shareToken}`)
      setGame({ ...game, shareToken })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur')
    }
  }

  const handleDisableShare = async () => {
    if (!game || !token) return
    try {
      await api.games.disableShare(token, game.id)
      setShareUrl(null)
      setGame({ ...game, shareToken: null })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur')
    }
  }

  const copyShareUrl = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="text-center py-12 text-text2">Chargement…</div>
  if (!game) return <div className="text-center py-12 text-text2">Partie introuvable. <Link to="/" className="text-accent2 hover:underline">Retour</Link></div>

  const isWin = game.result === 'WIN'

  if (editing) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Éditer la partie</h1>
        </header>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="card">
            <label className="label">Résultat</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={`py-3 border rounded-lg font-semibold transition ${form.result === 'WIN' ? 'bg-winBg text-win border-win' : 'bg-bg3 text-text2 border-border2'}`} onClick={() => setForm({ ...form, result: 'WIN' })}>Victoire</button>
              <button type="button" className={`py-3 border rounded-lg font-semibold transition ${form.result === 'LOSS' ? 'bg-lossBg text-loss border-loss' : 'bg-bg3 text-text2 border-border2'}`} onClick={() => setForm({ ...form, result: 'LOSS' })}>Défaite</button>
            </div>
          </div>

          <div className="card space-y-3">
            <div>
              <label className="label">Team adverse</label>
              <div className="grid grid-cols-2 gap-2">
                {form.advTeam.map((v, i) => (
                  <Autocomplete key={i} value={v} options={POKEMON_LIST} placeholder={`Pokémon ${i + 1}`}
                    onChange={(val) => { const c = [...form.advTeam]; c[i] = val; setForm({ ...form, advTeam: c }) }} />
                ))}
              </div>
            </div>
            <div>
              <label className="label">Lead adverse</label>
              <div className="grid grid-cols-2 gap-2">
                {form.advLeads.map((v, i) => (
                  <Autocomplete key={i} value={v} options={POKEMON_LIST} placeholder={`Lead ${i + 1}`}
                    onChange={(val) => { const c = [...form.advLeads]; c[i] = val; setForm({ ...form, advLeads: c }) }} />
                ))}
              </div>
            </div>
            <div>
              <label className="label">Mes leads</label>
              <div className="grid grid-cols-2 gap-2">
                {form.myLeads.map((v, i) => (
                  <Autocomplete key={i} value={v} options={POKEMON_LIST} placeholder={`Lead ${i + 1}`}
                    onChange={(val) => { const c = [...form.myLeads]; c[i] = val; setForm({ ...form, myLeads: c }) }} />
                ))}
              </div>
            </div>
            <div>
              <label className="label">Mes Pokémon joués</label>
              <div className="grid grid-cols-2 gap-2">
                {form.myPlayed.map((v, i) => (
                  <Autocomplete key={i} value={v} options={POKEMON_LIST} placeholder={`Pokémon ${i + 1}`}
                    onChange={(val) => { const c = [...form.myPlayed]; c[i] = val; setForm({ ...form, myPlayed: c }) }} />
                ))}
              </div>
            </div>
          </div>

          <div className="card space-y-3">
            <div>
              <label className="label">Ce que j'ai bien fait</label>
              <textarea className="input min-h-[60px] resize-y" value={form.noteGood} onChange={(e) => setForm({ ...form, noteGood: e.target.value })} />
            </div>
            <div>
              <label className="label">Ce que j'ai mal fait</label>
              <textarea className="input min-h-[60px] resize-y" value={form.noteBad} onChange={(e) => setForm({ ...form, noteBad: e.target.value })} />
            </div>
            <div>
              <label className="label">Moment clé</label>
              <textarea className="input min-h-[50px] resize-y" value={form.noteKey} onChange={(e) => setForm({ ...form, noteKey: e.target.value })} />
            </div>
          </div>

          {error && <div className="bg-lossBg border border-loss/40 text-loss text-sm rounded-lg px-3 py-2">{error}</div>}

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
            <button type="button" className="btn" onClick={() => setEditing(false)}>Annuler</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <header className="mb-6">
        <Link to="/" className="text-xs text-text2 hover:text-text1">← Retour aux parties</Link>
        <h1 className="text-2xl font-bold mt-1">Détail de la partie</h1>
      </header>

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

        <Detail label="Team adverse" items={game.advTeam} />
        <Detail label="Lead adverse" items={game.advLeads} color="accent2" />
        <Detail label="Mes leads" items={game.myLeads} color="win" />
        <Detail label="Mes Pokémon joués" items={game.myPlayed} color="win" />

        {(game.archetype || game.turn || game.speed || game.luck || game.mental) && (
          <div className="flex gap-1.5 flex-wrap mt-3">
            {game.archetype && <Meta label={game.archetype} />}
            {game.turn && <Meta label={game.turn} />}
            {game.speed && <Meta label={`Speed: ${game.speed}`} />}
            {game.luck && game.luck !== 'Neutre' && <Meta label={game.luck} />}
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

      <div className="card mt-4">
        <h3 className="text-sm font-semibold mb-3">Partage public</h3>
        {shareUrl ? (
          <div>
            <p className="text-xs text-text2 mb-2">N'importe qui avec ce lien peut voir cette partie :</p>
            <div className="flex gap-2 mb-3">
              <input type="text" readOnly value={shareUrl} className="input text-xs" />
              <button type="button" className="btn" onClick={copyShareUrl}>
                {copied ? '✓ Copié' : 'Copier'}
              </button>
            </div>
            <button type="button" className="text-xs text-loss hover:underline" onClick={handleDisableShare}>
              Désactiver le partage
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-text2 mb-3">Génère un lien public pour partager cette partie (Discord, Twitter...).</p>
            <button type="button" className="btn btn-primary" onClick={handleEnableShare}>
              Activer le partage
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button type="button" className="btn btn-primary" onClick={startEditing}>Éditer</button>
        <button type="button" className="btn" onClick={handleDelete}>Supprimer</button>
      </div>

      {error && <div className="bg-lossBg border border-loss/40 text-loss text-sm rounded-lg px-3 py-2 mt-3">{error}</div>}
    </div>
  )
}

function Detail({ label, items, color }: { label: string; items: string[]; color?: string }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  const colorClass = color === 'accent2'
    ? 'bg-[#1e3a5f] text-accent2 border-accent/40'
    : color === 'win'
      ? 'bg-winBg text-win border-win/40'
      : 'bg-bg3 text-text2 border-border2'

  return (
    <>
      <div className="text-[10px] font-semibold text-text2 mb-1.5 uppercase tracking-wider mt-3">{label}</div>
      <div className="flex gap-1.5 flex-wrap">
        {filtered.map((p, i) => (
          <span key={i} className={`text-xs px-2.5 py-1 rounded-full border ${colorClass}`}>{p}</span>
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
