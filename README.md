# Portfolio AG - Convex + Vercel

A production-ready portfolio application using **React + Vite** with **Convex** as the real-time backend, deployable to **Vercel**.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Convex Backend
```bash
npx convex dev
```
This will:
- Prompt you to log in to Convex
- Create a new project (or connect to existing)
- Generate `convex/_generated` files
- Create `.env.local` with your `VITE_CONVEX_URL`

### 3. Run Development Server
```bash
npm run dev
```

## 📦 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Convex integration complete"
git push origin main
```

### 2. Build the Frontend
```bash
npm run build
```

### 3. Deploy Convex to Production
```bash
npm run deploy
```
This will give you a production Convex URL.

### 4. Configure Vercel
1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Add Environment Variable:
   - `VITE_CONVEX_URL` = Your production Convex URL
3. Deploy!

## 🏗 Project Structure

```
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── messages.ts      # Message CRUD functions
│   ├── projects.ts      # Project CRUD functions
│   └── socials.ts       # Social links query
├── src/
│   ├── components/      # React components
│   ├── lib/             # Utilities & providers
│   ├── pages/           # Route pages
│   └── main.tsx         # App entry point
├── vercel.json          # Vercel config
└── .env.local.example   # Env template
```

## ⚡ Features

- **Real-time Updates**: Messages and projects sync automatically via Convex subscriptions
- **Error Handling**: Global ErrorBoundary for production resilience
- **TypeScript**: Full type safety with generated Convex types
- **Responsive**: Mobile-first design

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | Convex deployment URL (from `npx convex dev`) |

---

Built with Convex + Vite + React + TailwindCSS
