# VGC-Pro Backend

API Node.js + Express + TypeScript + Prisma + PostgreSQL

## ✅ Étape 1 — Setup initial (validée)
## 🔄 Étape 2 — Authentification

### Mise à jour pour l'étape 2

Depuis ton dossier `backend/` :

```bash
# 1. Installer les nouvelles dépendances (bcrypt, jsonwebtoken, zod)
npm install

# 2. Génère un JWT_SECRET aléatoire et mets-le dans .env
# Sur Mac/Linux :
openssl rand -base64 32

# Sur Windows PowerShell :
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 } | ForEach-Object { [byte]$_ }))

# Colle la valeur dans ton .env à la place de "change-me-with-a-real-secret"
```

### Redémarre le serveur

```bash
npm run dev
```

Tu devrais voir les nouvelles routes affichées dans la console.

### Teste les endpoints

#### 1. Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"tristan@test.com","username":"tristan","password":"motdepasse123"}'
```

Tu dois recevoir un user + un token JWT.

#### 2. Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tristan@test.com","password":"motdepasse123"}'
```

Tu reçois à nouveau un user + un token.

#### 3. Route protégée (récupérer son profil)

Copie le token de l'étape 2, puis :

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TON_TOKEN_ICI"
```

Tu reçois tes infos. Si tu mets un mauvais token → 401.

### Plus simple : avec Thunder Client ou Postman

Si tu utilises VS Code, installe l'extension **Thunder Client** ou **REST Client**. Ce sera plus pratique que curl.

## Structure mise à jour

```
src/
├── server.ts              Point d'entrée + routes
├── env.ts                 Variables d'env
├── prisma.ts              Client Prisma
├── routes/
│   ├── health.ts          GET /api/health
│   └── auth.ts            POST /register, /login + GET /me
├── middleware/
│   └── requireAuth.ts     Vérifie JWT → req.user
├── services/
│   └── auth.service.ts    Hash, vérif mdp, JWT
└── types/
    └── express.d.ts       Étend Request avec user
```

## Prochaine étape

✅ Étape 1 — Setup backend
✅ Étape 2 — Auth (inscription + login + JWT)
⬜ **Étape 3** — Frontend setup + page de connexion
⬜ Étape 4 — CRUD parties
⬜ ...
