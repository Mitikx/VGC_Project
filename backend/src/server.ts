import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import healthRouter from './routes/health.js'
import authRouter from './routes/auth.js'

const app = express()

// Middlewares
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(express.json())

// Routes
app.use('/api', healthRouter)
app.use('/api/auth', authRouter)

// Route racine pour vérifier que le serveur tourne
app.get('/', (_req, res) => {
  res.json({
    name: 'VGC-Pro API',
    version: '0.2.0',
    endpoints: {
      health: 'GET /api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me (protégée)',
    },
  })
})

// Gestionnaire d'erreur global - dernière barrière de sécurité
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Erreur non gérée :', err)
  res.status(500).json({ error: 'Erreur serveur' })
})

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

app.listen(env.PORT, () => {
  console.log(`\n🚀 VGC-Pro API démarrée`)
  console.log(`   → http://localhost:${env.PORT}`)
  console.log(`   → Health: http://localhost:${env.PORT}/api/health`)
  console.log(`   → Auth:   http://localhost:${env.PORT}/api/auth/{register|login|me}`)
  console.log(`   → Env:    ${env.NODE_ENV}\n`)
})
