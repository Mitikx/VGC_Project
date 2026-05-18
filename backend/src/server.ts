import './types/express.js'
import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import healthRouter from './routes/health.js'
import authRouter from './routes/auth.js'
import gamesRouter from './routes/games.js'
import teamRouter from './routes/team.js'
import profileRouter from './routes/profile.js'
import publicRouter from './routes/public.js'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(express.json())

app.use('/api', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/games', gamesRouter)
app.use('/api/team', teamRouter)
app.use('/api/profile', profileRouter)
app.use('/api/public', publicRouter)

app.get('/', (_req, res) => {
  res.json({
    name: 'VGC-Pro API',
    version: '0.6.0',
  })
})

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Erreur non gérée :', err)
  res.status(500).json({ error: 'Erreur serveur' })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

// Démarrage du serveur en local
// (en production sur Vercel, l'app est utilisée via api/index.ts en serverless)
if (process.env.NODE_ENV !== 'production') {
  app.listen(env.PORT, () => {
    console.log(`\n🚀 VGC-Pro API démarrée`)
    console.log(`   → http://localhost:${env.PORT}`)
    console.log(`   → Env: ${env.NODE_ENV}\n`)
  })
}

export default app
