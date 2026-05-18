// Page d'édition de mon profil

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { api, ApiError } from '@/lib/api'
import type { User } from '@/types'

export function ProfilePage() {
  const token = useAuthStore((s) => s.token)
  const refreshUser = useAuthStore((s) => s.refreshUser)
  const [user, setUser] = useState<User | null>(null)
  const [bio, setBio] = useState('')
  const [publicProfile, setPublicProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    api.profile.get(token)
      .then(({ user }) => {
        setUser(user)
        setBio(user.bio || '')
        setPublicProfile(!!user.publicProfile)
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erreur'))
      .finally(() => setLoading(false))
  }, [token])

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const { user: updated } = await api.profile.update(token, { bio, publicProfile })
      setUser(updated)
      setSuccess(true)
      refreshUser()
      setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-text2">Chargement…</div>
  if (!user) return null

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="text-sm text-text2 mt-1">Gère ta présence publique sur VGC-Pro.</p>
      </header>

      <div className="card mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-text2 text-xs mb-1">Username</div>
            <div className="font-semibold">@{user.username}</div>
          </div>
          <div>
            <div className="text-text2 text-xs mb-1">Email</div>
            <div className="font-semibold truncate">{user.email}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold mb-4">Profil public</h3>

        <div className="flex items-start gap-3 mb-4 p-3 bg-bg3 border border-border1 rounded-lg">
          <input
            type="checkbox"
            id="public"
            checked={publicProfile}
            onChange={(e) => setPublicProfile(e.target.checked)}
            className="mt-0.5 accent-accent"
          />
          <label htmlFor="public" className="text-sm cursor-pointer">
            <div className="font-semibold">Activer mon profil public</div>
            <p className="text-text2 text-xs mt-1">D'autres joueurs pourront voir ton profil et tes stats agrégées (sans détail des parties).</p>
          </label>
        </div>

        <div className="mb-4">
          <label className="label">Bio</label>
          <textarea
            className="input min-h-[80px] resize-y"
            placeholder="Joueur FR — passionné de VGC depuis 2024..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={280}
          />
          <div className="text-xs text-text3 mt-1 text-right">{bio.length} / 280</div>
        </div>

        {publicProfile && (
          <div className="bg-[#0d1829] border border-accent/40 text-accent2 text-xs rounded-lg p-3 mb-4">
            🌐 Ton profil sera accessible à : <Link to={`/u/${user.username}`} className="font-semibold hover:underline">{window.location.host}/u/{user.username}</Link>
          </div>
        )}

        {error && <div className="bg-lossBg border border-loss/40 text-loss text-sm rounded-lg px-3 py-2 mb-3">{error}</div>}
        {success && <div className="bg-winBg border border-win/40 text-win text-sm rounded-lg px-3 py-2 mb-3">✓ Profil enregistré</div>}

        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
