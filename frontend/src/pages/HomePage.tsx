import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamesStore } from '@/store/useGamesStore'
import { useTeamStore } from '@/store/useTeamStore'

export function HomePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const { games, loading, fetchGames, addGame, removeGame } = useGamesStore()
  const { team, fetchTeam } = useTeamStore()

  // Chargement initial des données
  useEffect(() => {
    fetchGames()
    fetchTeam()
  }, [])

  const [adding, setAdding] = useState(false)

  // Pour démontrer rapidement le CRUD : un bouton "Ajouter une partie test"
  const handleAddTestGame = async () => {
    setAdding(true)
    try {
      await addGame({
        result: Math.random() > 0.5 ? 'WIN' : 'LOSS',
        advTeam: ['Mistigrix', "Feunard d'Alola", 'Mackogneur', 'Typhlosion de Hisui'],
        advLeads: ['Mistigrix', "Feunard d'Alola"],
        myLeads: ['Mega Ptéra', 'Scalpereur'],
        myPlayed: ['Mega Ptéra', 'Scalpereur'],
        noteGood: 'Test partie générée automatiquement',
        noteBad: '',
      })
    } finally {
      setAdding(false)
    }
  }

  const handleLogout = () => {
    logout()
    useGamesStore.getState().reset()
    useTeamStore.getState().reset()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto py-8">

        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              VGC <span className="text-accent2">Pro</span>
            </h1>
            <p className="text-sm text-text2 mt-1">
              {user ? `${user.username}` : 'Chargement...'}
            </p>
          </div>
          <button className="btn" onClick={handleLogout}>Déconnexion</button>
        </header>

        {/* Équipe */}
        {team && (
          <div className="card mb-4">
            <h2 className="text-sm font-semibold mb-3 text-text2 uppercase tracking-wider">Mon équipe</h2>
            <div className="flex flex-wrap gap-2">
              {team.pokemon.map((p, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-bg3 border border-border2">{p}</span>
              ))}
            </div>
          </div>
        )}

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-accent2">{games.length}</div>
            <div className="text-xs text-text2 uppercase tracking-wider">Parties</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-win">{games.filter((g) => g.result === 'WIN').length}</div>
            <div className="text-xs text-text2 uppercase tracking-wider">Victoires</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-loss">{games.filter((g) => g.result === 'LOSS').length}</div>
            <div className="text-xs text-text2 uppercase tracking-wider">Défaites</div>
          </div>
        </div>

        {/* Bouton test */}
        <button
          className="btn btn-primary w-full mb-4"
          onClick={handleAddTestGame}
          disabled={adding}
        >
          {adding ? 'Création...' : '+ Ajouter une partie test'}
        </button>

        {/* Liste des parties */}
        <div className="card">
          <h2 className="text-sm font-semibold mb-4 text-text2 uppercase tracking-wider">
            Mes parties ({games.length})
          </h2>

          {loading && <div className="text-center py-8 text-text2 text-sm">Chargement...</div>}

          {!loading && games.length === 0 && (
            <div className="text-center py-8 text-text2 text-sm">
              Aucune partie. Clique sur "Ajouter une partie test" pour en créer une.
            </div>
          )}

          <div className="space-y-2">
            {games.map((g) => (
              <div key={g.id} className="bg-bg3 border border-border1 rounded-lg p-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${g.result === 'WIN' ? 'bg-winBg text-win' : 'bg-lossBg text-loss'}`}>
                      {g.result === 'WIN' ? 'V' : 'D'}
                    </span>
                    <span className="text-xs text-text2">
                      {new Date(g.playedAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs text-text2 truncate">
                    vs {g.advTeam.filter(Boolean).join(', ') || '—'}
                  </div>
                </div>
                <button
                  className="text-text3 hover:text-loss hover:bg-lossBg px-2 py-1 rounded text-sm transition"
                  onClick={() => { if (confirm('Supprimer ?')) removeGame(g.id) }}
                  aria-label="Supprimer"
                >✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-text3 mt-6">
          Étape 4 — CRUD avec backend ✅
        </div>
      </div>
    </div>
  )
}
