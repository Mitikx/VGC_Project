// Routes pour l'équipe de l'utilisateur (1 équipe par user)
//   GET /api/team       - récupère mon équipe (crée une équipe par défaut si vide)
//   PUT /api/team       - met à jour mon équipe

import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

const DEFAULT_TEAM = ['Mega Ptéra', 'Carchacrok', 'Sucreine', 'Florizarre', 'Chartor', 'Scalpereur']

const teamSchema = z.object({
  pokemon: z.array(z.string()).length(6, "L'équipe doit contenir exactement 6 Pokémon"),
})

// GET /api/team
router.get('/', async (req: Request, res: Response) => {
  const userId = req.user!.userId
  let team = await prisma.team.findUnique({ where: { userId } })

  // Si le user n'a pas encore d'équipe, on en crée une par défaut
  if (!team) {
    team = await prisma.team.create({
      data: { userId, pokemon: DEFAULT_TEAM },
    })
  }
  res.json({ team })
})

// PUT /api/team
router.put('/', async (req: Request, res: Response) => {
  const parsed = teamSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation échouée',
      details: parsed.error.flatten().fieldErrors,
    })
  }

  const userId = req.user!.userId
  // upsert : crée si n'existe pas, sinon met à jour
  const team = await prisma.team.upsert({
    where: { userId },
    create: { userId, pokemon: parsed.data.pokemon },
    update: { pokemon: parsed.data.pokemon },
  })
  res.json({ team })
})

export default router
