import 'dotenv/config'

// Validation et exposition typée des variables d'environnement
// Si une variable critique manque, on plante au démarrage (mieux que crash plus tard)

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}\nCopie .env.example vers .env et remplis les valeurs.`)
  }
  return value
}

export const env = {
  DATABASE_URL: required('DATABASE_URL'),
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
} as const
