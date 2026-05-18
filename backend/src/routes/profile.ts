// Gestion du profil de l'utilisateur connecté

import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

const profileSchema = z.object({
  bio: z.string().max(280, 'Bio trop longue (280 caractères max)').default(''),
  publicProfile: z.boolean().default(false),
})

router.get('/', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true, email: true, username: true, bio: true, publicProfile: true, createdAt: true,
    },
  })
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
  res.json({ user })
})

router.put('/', async (req: Request, res: Response) => {
  const parsed = profileSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation échouée', details: parsed.error.flatten().fieldErrors })
  }
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: parsed.data,
    select: {
      id: true, email: true, username: true, bio: true, publicProfile: true, createdAt: true,
    },
  })
  res.json({ user })
})

export default router
