# VGC-Pro

Application web pour la communauté VGC Pokémon Champions FR.

## ✅ Étape 6 — Édition + partage + profils publics + calendrier + saisie rapide

## Démarrage

**Terminal 1 — Backend :**
```bash
cd backend
npm install
npm run db:push   # ⚠️ Important : applique les changements de schéma
npm run dev
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm install
npm run dev
```

Ouvre http://localhost:5173

## Nouvelles routes

**Privées :**
- `/quick` — saisie rapide
- `/games/:id` — détail/édition d'une partie
- `/profile` — édition de mon profil

**Publiques (sans compte) :**
- `/u/:username` — profil public d'un user
- `/share/:token` — partie partagée

## Tests à faire

1. **Saisie rapide** : clique "⚡ Rapide" → Victoire + 4 Pokémon → tu arrives sur la page détail
2. **Édition** : sur la page détail, clique "Éditer" → modifie et enregistre
3. **Partage** : sur la page détail, active le partage → copie le lien → ouvre dans une fenêtre privée
4. **Profil** : clique "Profil" → active le profil public + bio → enregistre → va sur `/u/ton_username`
5. **Calendrier** : clique "Voir le calendrier" sur la page Parties
