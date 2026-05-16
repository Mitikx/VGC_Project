// CRUD des parties (toutes les routes sont protégées par requireAuth)
//   POST   /api/games      - créer une partie
//   GET    /api/games      - lister mes parties (les plus récentes en premier)
//   GET    /api/games/:id  - détail d'une partie
//   DELETE /api/games/:id  - supprimer une partie

import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth) // toutes les routes ci-dessous nécessitent un token

// Schéma de validation pour créer une partie
const createGameSchema = z.object({
  result: z.enum(['WIN', 'LOSS']),
  advTeam:  z.array(z.string()).max(4).default([]),
  advLeads: z.array(z.string()).max(2).default([]),
  myLeads:  z.array(z.string()).max(2).default([]),
  myPlayed: z.array(z.string()).max(2).default([]),
  archetype: z.string().nullable().optional(),
  turn:      z.string().nullable().optional(),
  speed:     z.string().nullable().optional(),
  luck:      z.string().nullable().optional(),
  mental:    z.string().nullable().optional(),
  rating:    z.number().int().min(1).max(5).nullable().optional(),
  tags:      z.array(z.string()).default([]),
  noteKey:   z.string().default(''),
  noteGood:  z.string().default(''),
  noteBad:   z.string().default(''),
})

// ── POST /api/games ────────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  const parsed = createGameSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation échouée',
      details: parsed.error.flatten().fieldErrors,
    })
  }

  const data = parsed.data
  const game = await prisma.game.create({
    data: {
      userId: req.user!.userId,
      result: data.result,
      advTeam: data.advTeam.filter(Boolean),
      advLeads: data.advLeads.filter(Boolean),
      myLeads: data.myLeads.filter(Boolean),
      myPlayed: data.myPlayed.filter(Boolean),
      archetype: data.archetype ?? null,
      turn: data.turn ?? null,
      speed: data.speed ?? null,
      luck: data.luck ?? null,
      mental: data.mental ?? null,
      rating: data.rating ?? null,
      tags: data.tags,
      noteKey: data.noteKey,
      noteGood: data.noteGood,
      noteBad: data.noteBad,
    },
  })
  res.status(201).json({ game })
})

// ── GET /api/games ─────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  const games = await prisma.game.findMany({
    where: { userId: req.user!.userId },
    orderBy: { playedAt: 'desc' },
  })
  res.json({ games })
})

// ── GET /api/games/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  const game = await prisma.game.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  })
  if (!game) return res.status(404).json({ error: 'Partie introuvable' })
  res.json({ game })
})

// ── DELETE /api/games/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  // On s'assure que la partie appartient bien à l'utilisateur connecté
  // avant de la supprimer.
  const game = await prisma.game.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  })
  if (!game) return res.status(404).json({ error: 'Partie introuvable' })

  await prisma.game.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

export default router
