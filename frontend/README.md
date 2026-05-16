# VGC-Pro Frontend

React 18 + TypeScript + Vite + Tailwind + Zustand + React Router

## Étape 3 — Frontend qui se connecte au backend

### 1. Installer les dépendances

```bash
cd frontend
npm install
```

### 2. Configurer l'environnement

```bash
# Copier le template
cp .env.example .env

# Le contenu par défaut suffit si ton backend tourne sur http://localhost:3000
```

### 3. Lancer le serveur de dev

```bash
npm run dev
```

Ouvre http://localhost:5173

### 4. Tester l'app

**Important** : le backend (sur le port 3000) doit tourner en parallèle.

Tu auras 3 pages :
- `/register` — créer un compte
- `/login` — se connecter
- `/` — page protégée (redirige vers /login si pas connecté)

**Flow de test** :
1. Créer un compte sur `/register` → tu es redirigé sur la home
2. Tu vois tes infos affichées
3. Clic "Déconnexion" → retour login
4. Te reconnecter → home
5. Recharger la page : tu restes connecté (le token est persisté)

## Structure

```
src/
├── main.tsx                      Point d'entrée + BrowserRouter
├── App.tsx                       Routes
├── index.css                     Tailwind + composants utilitaires
├── lib/
│   └── api.ts                    Client API centralisé + gestion erreurs
├── store/
│   └── useAuthStore.ts           État global auth (Zustand + persist)
├── components/
│   └── ProtectedRoute.tsx        HOC pour protéger les routes
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── HomePage.tsx
└── types/
    └── index.ts                  Types partagés
```

## Prochaine étape

✅ Étape 3 — Frontend setup + connexion au backend
⬜ **Étape 4** — CRUD parties (créer, lire, supprimer des parties en DB)
