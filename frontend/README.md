# VGC-Pro Frontend

React 18 + TypeScript + Vite + Tailwind + Zustand + React Router

## 🔄 Étape 4 — Frontend qui parle au backend

### Mise à jour

```bash
cd frontend
# Les dépendances sont les mêmes qu'à l'étape 3, mais relance install
# si tu as téléchargé un zip frais
npm install
npm run dev
```

### Ce qui marche maintenant

La page d'accueil affiche :
- Ton équipe (chargée depuis la DB, créée automatiquement par défaut)
- Tes stats (parties, victoires, défaites)
- Un bouton "Ajouter une partie test" pour démontrer le POST
- La liste de tes parties avec bouton supprimer

C'est une UI **basique** uniquement pour valider que la chaîne complète marche :
**Frontend → Backend → DB → DB → Backend → Frontend**

À l'étape 5 on remplacera ça par un vrai formulaire de saisie avec autocomplete Pokémon, tags, notes, etc.

### Test à faire

1. Va sur http://localhost:5173 (connecté)
2. Tu vois ton équipe par défaut
3. Clique "Ajouter une partie test" plusieurs fois
4. Les parties s'affichent
5. Recharge la page : elles sont toujours là (DB)
6. Déconnecte-toi puis reconnecte : tes parties sont là
7. Crée un autre compte : ses parties sont isolées (chacun voit les siennes)

## Avancement

✅ Étape 4 — CRUD parties depuis le frontend
⬜ Étape 5 — UI saisie complète avec autocomplete + stats
