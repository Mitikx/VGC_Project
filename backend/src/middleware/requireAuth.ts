// Middleware Express qui vérifie le JWT dans le header Authorization
// et attache l'utilisateur à req.user.
// Si le token manque ou est invalide → 401.
//
// Usage : router.get('/profile', requireAuth, ...)

import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/auth.service.js'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  const token = header.slice('Bearer '.length).trim()

  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}
