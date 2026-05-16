# VGC-Pro

Application web pour la communauté VGC Pokémon Champions FR.

**Fonctionnalités prévues :**
- Journal de parties personnel
- Statistiques et coach automatique (insights)
- Speed tier comparatif (tes Pokémon vs méta)
- Quiz de matchup interactif
- Draft simulator sérieux avec analyse
- Encyclopédie communautaire des matchups

## Stack technique

- **Frontend** : React 18 + TypeScript + Vite + Tailwind + React Router + Zustand
- **Backend** : Node.js + Express + TypeScript + Prisma
- **Base de données** : PostgreSQL (Neon)
- **Hébergement** : Vercel (front) + Railway (back)

## Structure

```
vgc-pro/
├── backend/    API Node.js + Express
└── frontend/   App React (à venir étape 3)
```

## Étape actuelle

✅ Étape 1 — Setup backend
⬜ Étape 2 — Authentification (inscription + login + JWT)
⬜ Étape 3 — Setup frontend + connexion au backend
⬜ Étape 4 — CRUD parties
⬜ Étape 5 — UI des parties + stats
⬜ Étape 6 — Coach / insights
⬜ Étape 7 — Features avancées

Voir `backend/README.md` pour démarrer l'étape 1.
