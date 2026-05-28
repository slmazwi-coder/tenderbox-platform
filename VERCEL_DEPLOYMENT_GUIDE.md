# Vercel Deployment Guide

This project has been configured for deployment on Vercel as a Static SPA (Single Page Application).

## What Changed

1. **vercel.json**: Updated for static SPA deployment
   - Output directory set to `dist/client`
   - Rewrites configured for client-side routing (all paths serve `index.html`)
   - Removed Node.js runtime requirement

2. **scripts/post-build.js**: Created post-build script
   - Copies CSS files from server build to client assets
   - Generates `index.html` for the SPA entry point

3. **package.json**: Updated build script
   - Runs Vite build followed by post-build script
   - Removed Node.js server start script

## Deployment Steps

1. **Connect your GitHub repository to Vercel**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose this repository

2. **Configure Environment Variables**
   - In Vercel project settings, add any required environment variables from your `.env` file:
     - Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, etc.)
     - Any other API keys or configuration

3. **Deploy**
   - Vercel will automatically:
     - Run `npm install`
     - Run `npm run build`
     - Serve static files from `dist/client`

## How It Works

This is a static SPA (Single Page Application):
- The app uses TanStack Router for client-side routing
- All routes are handled by JavaScript on the client
- The server (Vercel) only serves static files
- API calls go directly to Supabase (or other backends)

## Architecture

This is a frontend TanStack Start application:
- **Frontend**: React 19 with TanStack Router
- **Routing**: Client-side routing with Vercel rewrites
- **Database**: Supabase (PostgreSQL) accessed directly from client
- **UI Components**: Radix UI + Tailwind CSS

## Limitations

This deployment mode does NOT support:
- Server-side rendering (SSR)
- Server-side API routes
- Node.js server functionality

If you need SSR or server-side functionality:
1. Use a different deployment target (e.g., Cloudflare Workers)
2. Or implement API calls through a separate backend service
