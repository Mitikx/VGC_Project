import { Router } from 'express'
import { prisma } from '../prisma.js'

const router = Router()

// GET /health
// Vérifie que le serveur tourne ET que la DB répond
router.get('/health', async (_req, res) => {
  try {
    // Test simple de connexion à la DB
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    })
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router
