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

### 2. Deploy Convex to Production
```bash
npm run deploy:convex
```
This will give you a production Convex URL.

### 3. Configure Vercel
1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Confirm the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add these environment variables in Vercel Project Settings:
   - `VITE_CONVEX_URL` = Your production Convex URL
   - `VITE_CLERK_PUBLISHABLE_KEY` = Your Clerk frontend publishable key
   - `VITE_ADMIN_EMAIL` = Email address allowed into the admin area
   - `VITE_CLOUDINARY_CLOUD_NAME` = Optional Cloudinary override
   - `VITE_CLOUDINARY_UPLOAD_PRESET` = Optional Cloudinary override
   - `VITE_CRISP_WEBSITE_ID` = Optional Crisp chat widget ID
4. Deploy!

## 🏗 Build Commands

- `npm run build` — builds the Vite frontend only
- `npm run deploy:convex` — deploys Convex separately
- `npm run build:production` — deploys Convex first, then builds the frontend

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
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key required by the auth provider |
| `VITE_ADMIN_EMAIL` | Email address allowed to access the admin panel |
| `VITE_CLOUDINARY_CLOUD_NAME` | Optional Cloudinary cloud name override |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Optional Cloudinary upload preset override |
| `VITE_CRISP_WEBSITE_ID` | Optional Crisp website ID |

---

Built with Convex + Vite + React + TailwindCSS
