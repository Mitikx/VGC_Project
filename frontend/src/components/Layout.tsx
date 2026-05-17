// Layout global : sidebar (desktop) + bottom nav (mobile) + zone principale

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamesStore } from '@/store/useGamesStore'
import { useTeamStore } from '@/store/useTeamStore'

interface LayoutProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { to: '/', label: 'Parties', icon: '📋' },
  { to: '/new', label: 'Nouvelle', icon: '＋' },
  { to: '/stats', label: 'Stats', icon: '📊' },
  { to: '/team', label: 'Équipe', icon: '⚔' },
]

export function Layout({ children }: LayoutProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    useGamesStore.getState().reset()
    useTeamStore.getState().reset()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Sidebar desktop / Top bar mobile */}
      <aside className="md:w-60 md:flex md:flex-col md:border-r md:border-border1 md:fixed md:inset-y-0 md:left-0 bg-bg2 md:bg-bg">
        <div className="hidden md:flex md:flex-col h-full">
          <div className="p-5 border-b border-border1">
            <h1 className="text-xl font-bold">
              VGC <span className="text-accent2">Pro</span>
            </h1>
            <p className="text-xs text-text2 mt-1">Pokémon Champions</p>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-text2 hover:bg-bg3 hover:text-text1'
                  }`
                }
              >
                <span className="text-base">{it.icon}</span>
                <span>{it.label}</span>
              </NavLink>
            ))}
          </nav>

          {user && (
            <div className="p-3 border-t border-border1">
              <div className="text-xs text-text2 mb-2">Connecté en tant que</div>
              <div className="text-sm font-semibold mb-3">{user.username}</div>
              <button
                onClick={handleLogout}
                className="w-full text-xs text-text2 hover:text-loss text-left transition"
              >
                Déconnexion →
              </button>
            </div>
          )}
        </div>

        {/* Header mobile */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border1">
          <h1 className="text-lg font-bold">
            VGC <span className="text-accent2">Pro</span>
          </h1>
          <button onClick={handleLogout} className="text-xs text-text2 hover:text-loss">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Zone principale */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg2 border-t border-border1 flex z-40">
        {NAV_ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-[10px] uppercase font-semibold tracking-wider transition ${
                isActive ? 'text-accent2' : 'text-text2'
              }`
            }
          >
            <span className="text-lg">{it.icon}</span>
            {it.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
