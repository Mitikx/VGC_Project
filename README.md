# VGC-Pro

Application web pour la communauté VGC Pokémon Champions FR.

## Avancement

✅ Étape 1 — Setup backend
✅ Étape 2 — Authentification (JWT)
✅ Étape 3 — Frontend ↔ backend (login/register)
✅ Étape 4 — **CRUD parties + équipe en DB**
⬜ Étape 5 — UI saisie complète (formulaire avec autocomplete Pokémon)
⬜ Étape 6 — Page stats + coach
⬜ Étape 7 — Features avancées

## Démarrage

**Terminal 1 — Backend :**
```bash
cd backend
npm install
npm run db:push     # crée les tables games + teams
npm run dev
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm install
npm run dev
```

Ouvre http://localhost:5173

Voir `backend/README.md` et `frontend/README.md` pour les détails.
