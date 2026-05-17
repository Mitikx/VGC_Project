// App principal : routing global

import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Layout } from '@/components/Layout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { PartiesPage } from '@/pages/PartiesPage'
import { NewGamePage } from '@/pages/NewGamePage'
import { StatsPage } from '@/pages/StatsPage'
import { TeamPage } from '@/pages/TeamPage'

export default function App() {
  const token = useAuthStore((s) => s.token)
  const refreshUser = useAuthStore((s) => s.refreshUser)

  // Au démarrage : si on a un token persisté, on vérifie qu'il est encore valide
  useEffect(() => {
    if (token) refreshUser()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes protégées avec layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout><PartiesPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/new"
        element={
          <ProtectedRoute>
            <Layout><NewGamePage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Layout><StatsPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <Layout><TeamPage /></Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
