// Étend le type Request d'Express pour qu'il puisse contenir
// l'utilisateur authentifié (rempli par le middleware auth).

import type { JwtPayload } from '../services/auth.service.js'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export {}
