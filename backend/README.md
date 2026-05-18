# VGC-Pro Backend

API Node.js + Express + TypeScript + Prisma + PostgreSQL

## 🚀 Étape 6 — Édition, partage, profils publics

### Mise à jour

```bash
cd backend

# Le schéma a changé : nouveaux champs (bio, publicProfile, shareToken)
npm run db:push

# Relance le serveur
npm run dev
```

⚠️ Le `db:push` ajoute les champs `bio`, `publicProfile` (sur User) et `shareToken` (sur Game). Tes données existantes sont conservées.

### Nouveaux endpoints

#### Parties
- `PUT /api/games/:id` — éditer une partie
- `POST /api/games/:id/share` — activer un lien public
- `DELETE /api/games/:id/share` — désactiver

#### Profil
- `GET /api/profile` — mon profil complet
- `PUT /api/profile` — éditer bio + visibilité

#### Public (sans auth)
- `GET /api/public/users/:username` — profil public + stats
- `GET /api/public/share/:token` — partie partagée
