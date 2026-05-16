import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { ApiError } from '@/lib/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const loading = useAuthStore((s) => s.loading)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    try {
      await register(email, username, password)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        if (err.details) setFieldErrors(err.details)
      } else {
        setError('Erreur inconnue')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            VGC <span className="text-accent2">Pro</span>
          </h1>
          <p className="text-sm text-text2 mt-2">Pokémon Champions FR</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-6">Créer un compte</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              {fieldErrors.email?.map((m, i) => <div key={i} className="field-error">{m}</div>)}
            </div>
            <div>
              <label className="label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="input"
                placeholder="tristan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
              />
              {fieldErrors.username?.map((m, i) => <div key={i} className="field-error">{m}</div>)}
            </div>
            <div>
              <label className="label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="8 caractères minimum"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              {fieldErrors.password?.map((m, i) => <div key={i} className="field-error">{m}</div>)}
            </div>

            {error && !Object.keys(fieldErrors).length && (
              <div className="bg-lossBg border border-loss/40 text-loss text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Création...' : 'Créer le compte'}
            </button>
          </form>

          <div className="text-center text-sm text-text2 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-accent2 hover:underline">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
