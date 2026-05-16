import { PrismaClient } from '@prisma/client'

// Singleton pour éviter de créer plusieurs connexions en dev (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var prismaInstance: PrismaClient | undefined
}

export const prisma =
  global.prismaInstance ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prismaInstance = prisma
}
