import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export function HomePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
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
            <p className="text-sm text-text2 mt-1">Pokémon Champions FR</p>
          </div>
          <button className="btn" onClick={handleLogout}>Déconnexion</button>
        </header>

        {user && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">Bienvenue, {user.username} 👋</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border1 pb-2">
                <span className="text-text2">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between border-b border-border1 pb-2">
                <span className="text-text2">Username</span>
                <span>{user.username}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-text2">Inscrit le</span>
                <span>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Étape 3 validée ✅</h2>
          <p className="text-sm text-text2 leading-relaxed">
            L'authentification frontend ↔ backend fonctionne ! Tu es connecté avec un token JWT
            persisté dans ton navigateur.
          </p>
          <div className="mt-4 p-4 bg-bg3 border border-border1 rounded-lg">
            <p className="text-xs text-text2 mb-2">Prochaines étapes :</p>
            <ul className="text-sm space-y-1 text-text2">
              <li>⬜ Étape 4 — CRUD parties (sauvegarder en DB)</li>
              <li>⬜ Étape 5 — UI parties + stats</li>
              <li>⬜ Étape 6 — Coach / insights</li>
              <li>⬜ Étape 7 — Features avancées</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
