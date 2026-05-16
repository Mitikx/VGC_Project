// Routes d'authentification :
//  POST /api/auth/register  - inscription
//  POST /api/auth/login     - connexion
//  GET  /api/auth/me        - infos de l'utilisateur connecté (protégée)

import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { hashPassword, verifyPassword, generateToken } from '../services/auth.service.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

// Schémas de validation Zod : si l'input est invalide, on retourne 400
// avec un message clair. Bien meilleur que de planter avec une erreur DB.
const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  username: z.string()
    .min(3, 'Username trop court (3 caractères min)')
    .max(20, 'Username trop long (20 caractères max)')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username : lettres, chiffres, _ ou - uniquement'),
  password: z.string().min(8, 'Mot de passe trop court (8 caractères min)'),
})

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation échouée',
      details: parsed.error.flatten().fieldErrors,
    })
  }

  const { email, username, password } = parsed.data

  // Vérifier qu'aucun user n'existe avec cet email ou username
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })
  if (existing) {
    return res.status(409).json({
      error: existing.email === email ? 'Email déjà utilisé' : 'Username déjà pris',
    })
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: { email, username, passwordHash },
    select: { id: true, email: true, username: true, createdAt: true },
  })

  const token = generateToken({ userId: user.id, email: user.email })

  res.status(201).json({ user, token })
})

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation échouée',
      details: parsed.error.flatten().fieldErrors,
    })
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // On reste vague : pareil pour user inexistant et mauvais mdp.
    // C'est une bonne pratique pour ne pas révéler si l'email existe.
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }

  const token = generateToken({ userId: user.id, email: user.email })

  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    },
    token,
  })
})

// GET /api/auth/me — protégée par requireAuth
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  // req.user est défini par le middleware
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, username: true, createdAt: true },
  })
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })

  res.json({ user })
})

export default router
