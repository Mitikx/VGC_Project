// Routes publiques (sans authentification)

import { Router, type Request, type Response } from 'express'
import { prisma } from '../prisma.js'

const router = Router()

// Partie partagée via lien
router.get('/share/:token', async (req: Request, res: Response) => {
  const game = await prisma.game.findUnique({
    where: { shareToken: req.params.token },
    include: { user: { select: { username: true } } },
  })
  if (!game) return res.status(404).json({ error: 'Partie introuvable ou partage révoqué' })

  const { user, ...gameData } = game
  res.json({ game: gameData, username: user.username })
})

// Profil public d'un user
router.get('/users/:username', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    select: {
      id: true, username: true, bio: true, publicProfile: true, createdAt: true,
      team: { select: { pokemon: true } },
    },
  })
  if (!user || !user.publicProfile) {
    return res.status(404).json({ error: 'Profil introuvable ou privé' })
  }

  const allGames = await prisma.game.findMany({
    where: { userId: user.id },
    select: { result: true, playedAt: true },
    orderBy: { playedAt: 'desc' },
    take: 100,
  })

  const wins = allGames.filter((g) => g.result === 'WIN').length
  const total = allGames.length
  const winrate = total > 0 ? Math.round((wins / total) * 100) : 0

  res.json({
    user: {
      username: user.username,
      bio: user.bio,
      createdAt: user.createdAt,
      team: user.team?.pokemon || [],
    },
    stats: { total, wins, losses: total - wins, winrate },
    recentResults: allGames.slice(0, 20).map((g) => g.result),
  })
})

export default router
