# VGC-Pro Frontend

React 18 + TypeScript + Vite + Tailwind + Zustand + React Router

## 🎨 Étape 5 — Vraie UI complète

### Mise à jour

```bash
cd frontend
npm install   # juste au cas où
npm run dev
```

### Ce que tu as maintenant

**Layout général** :
- Sidebar à gauche (desktop)
- Bottom navigation (mobile)
- 4 pages principales

**Pages** :
- `/` — **Parties** : liste avec recherche + filtres (toutes / victoires / défaites)
- `/new` — **Nouvelle partie** : formulaire complet avec autocomplete Pokémon
- `/stats` — **Statistiques** : winrate, duos, leads, adversaires, archétypes, mental, etc.
- `/team` — **Équipe** : édition des 6 Pokémon

**Composants réutilisables** :
- `Autocomplete` — sélection de Pokémon avec recherche
- `GameCard` — affichage d'une partie
- `Layout` — sidebar + nav

### Test à faire

1. Va sur `/team` → édite ton équipe
2. Va sur `/new` → crée une vraie partie (saisis quelques Pokémon, joue avec les détails)
3. Retour sur `/` → tu vois ta partie dans la liste
4. Va sur `/stats` → tu vois les premières stats
5. Crée plusieurs parties pour voir les stats évoluer
6. Teste la recherche sur `/`
7. Teste le mobile (Ctrl+Shift+I → mode device)

## Avancement

✅ Étape 5 — Vraie UI complète
⬜ Étape 6 — Coach / insights automatiques
⬜ Étape 7 — Features avancées (speed tier, quiz, draft, encyclopédie)
