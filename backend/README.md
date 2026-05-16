# VGC-Pro Backend

API Node.js + Express + TypeScript + Prisma + PostgreSQL

## 🔄 Étape 4 — CRUD parties et équipe

### Mise à jour

```bash
cd backend

# 1. Mettre à jour le schéma DB (nouvelles tables : Team, Game)
npm run db:push

# 2. Redémarrer le serveur
npm run dev
```

⚠️ Le `db:push` va créer les tables `teams` et `games`. Tes données users existantes ne sont pas affectées.

### Nouveaux endpoints

Toutes ces routes nécessitent un header `Authorization: Bearer <token>` (sauf register/login/health).

#### Parties (CRUD)
- `POST /api/games` — créer une partie
- `GET /api/games` — lister mes parties
- `GET /api/games/:id` — détail
- `DELETE /api/games/:id` — supprimer

#### Équipe
- `GET /api/team` — récupérer mon équipe (en crée une par défaut si vide)
- `PUT /api/team` — mettre à jour mon équipe (les 6 Pokémon)

### Structure du schéma DB

```
users  ── 1:1 ── teams
       └─ 1:N ── games
```

Chaque user a UNE équipe (créée automatiquement à la première requête) et N parties.

## Avancement

✅ Étape 1 — Setup backend
✅ Étape 2 — Auth (JWT)
✅ Étape 3 — Frontend connecté
✅ Étape 4 — CRUD parties + équipe
⬜ Étape 5 — Vraie UI parties + saisie complète + stats
⬜ ...
