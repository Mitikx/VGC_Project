import './types/express.js'
import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import healthRouter from './routes/health.js'
import authRouter from './routes/auth.js'
import gamesRouter from './routes/games.js'
import teamRouter from './routes/team.js'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(express.json())

app.use('/api', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/games', gamesRouter)
app.use('/api/team', teamRouter)

app.get('/', (_req, res) => {
  res.json({
    name: 'VGC-Pro API',
    version: '0.4.0',
    endpoints: {
      health:   'GET    /api/health',
      register: 'POST   /api/auth/register',
      login:    'POST   /api/auth/login',
      me:       'GET    /api/auth/me',
      games:    'GET/POST/DELETE /api/games[/:id]',
      team:     'GET/PUT /api/team',
    },
  })
})

// Gestionnaire d'erreur global
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Erreur non gérée :', err)
  res.status(500).json({ error: 'Erreur serveur' })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

export default app
