// CRUD des parties + édition + partage public

import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

const gameInputSchema = z.object({
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

router.post('/', async (req: Request, res: Response) => {
  const parsed = gameInputSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation échouée', details: parsed.error.flatten().fieldErrors })
  }

  const d = parsed.data
  const game = await prisma.game.create({
    data: {
      userId: req.user!.userId,
      result: d.result,
      advTeam: d.advTeam.filter(Boolean),
      advLeads: d.advLeads.filter(Boolean),
      myLeads: d.myLeads.filter(Boolean),
      myPlayed: d.myPlayed.filter(Boolean),
      archetype: d.archetype ?? null,
      turn: d.turn ?? null,
      speed: d.speed ?? null,
      luck: d.luck ?? null,
      mental: d.mental ?? null,
      rating: d.rating ?? null,
      tags: d.tags,
      noteKey: d.noteKey,
      noteGood: d.noteGood,
      noteBad: d.noteBad,
    },
  })
  res.status(201).json({ game })
})

router.get('/', async (req: Request, res: Response) => {
  const games = await prisma.game.findMany({
    where: { userId: req.user!.userId },
    orderBy: { playedAt: 'desc' },
  })
  res.json({ games })
})

router.get('/:id', async (req: Request, res: Response) => {
  const game = await prisma.game.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  })
  if (!game) return res.status(404).json({ error: 'Partie introuvable' })
  res.json({ game })
})

// Édition d'une partie
router.put('/:id', async (req: Request, res: Response) => {
  const existing = await prisma.game.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  })
  if (!existing) return res.status(404).json({ error: 'Partie introuvable' })

  const parsed = gameInputSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation échouée', details: parsed.error.flatten().fieldErrors })
  }

  const d = parsed.data
  const game = await prisma.game.update({
    where: { id: req.params.id },
    data: {
      result: d.result,
      advTeam: d.advTeam.filter(Boolean),
      advLeads: d.advLeads.filter(Boolean),
      myLeads: d.myLeads.filter(Boolean),
      myPlayed: d.myPlayed.filter(Boolean),
      archetype: d.archetype ?? null,
      turn: d.turn ?? null,
      speed: d.speed ?? null,
      luck: d.luck ?? null,
      mental: d.mental ?? null,
      rating: d.rating ?? null,
      tags: d.tags,
      noteKey: d.noteKey,
      noteGood: d.noteGood,
      noteBad: d.noteBad,
    },
  })
  res.json({ game })
})

router.delete('/:id', async (req: Request, res: Response) => {
  const game = await prisma.game.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  })
  if (!game) return res.status(404).json({ error: 'Partie introuvable' })

  await prisma.game.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

// Activer le partage public
router.post('/:id/share', async (req: Request, res: Response) => {
  const game = await prisma.game.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  })
  if (!game) return res.status(404).json({ error: 'Partie introuvable' })

  const shareToken = game.shareToken || randomBytes(16).toString('hex')
  const updated = await prisma.game.update({
    where: { id: req.params.id },
    data: { shareToken },
  })
  res.json({ game: updated, shareToken })
})

// Désactiver le partage
router.delete('/:id/share', async (req: Request, res: Response) => {
  const game = await prisma.game.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  })
  if (!game) return res.status(404).json({ error: 'Partie introuvable' })

  const updated = await prisma.game.update({
    where: { id: req.params.id },
    data: { shareToken: null },
  })
  res.json({ game: updated })
})

export default router
