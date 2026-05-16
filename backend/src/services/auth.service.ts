// Service d'authentification
// On centralise toute la logique d'auth ici pour pouvoir la réutiliser
// et la tester facilement, sans la mélanger avec Express.

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'

const SALT_ROUNDS = 10                  // Sécurité du hash bcrypt
const JWT_EXPIRES_IN = '7d'             // Durée de validité du token

export interface JwtPayload {
  userId: string
  email: string
}

// Hash un mot de passe avec bcrypt
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

// Vérifie un mot de passe contre son hash
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

// Génère un JWT signé contenant l'ID + email de l'utilisateur
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Vérifie un JWT, retourne le payload si valide, sinon throw
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}
