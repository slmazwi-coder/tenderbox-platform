# Vercel Node.js Deployment Guide

This project has been configured for deployment on Vercel with Node.js runtime.

## What Changed

1. **vercel.json**: Updated to use Node.js-compatible settings
   - Removed Cloudflare-specific plugins
   - Set framework to "other" for custom TanStack Start configuration
   - Updated output directory to "dist"

2. **vite.config.ts**: Removed Cloudflare adapter configuration
   - The config now focuses on TanStack Start without Workers-specific plugins
   - Builds a standard Node.js compatible server

3. **package.json**: Added `start` script
   - This is the entry point Vercel will use to run the application
   - Uses `NODE_ENV=production node dist/server.js`

4. **.vercelignore**: Added to exclude unnecessary files
   - Ignores Cloudflare-specific files (wrangler.jsonc)
   - Reduces build size

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
     - Run `bun install`
     - Run `bun run build`
     - Start the server with the `start` script
     - Serve both static assets and SSR pages

## Troubleshooting

### Build Fails
- Check that all environment variables are set in Vercel project settings
- Verify `build` script works locally: `bun run build`
- Check Vercel build logs for specific error messages

### Server Crashes
- Ensure the `start` script can find and execute `dist/server.js`
- Check Node.js version compatibility (Vercel uses Node.js 20.x by default)
- Review Vercel function logs for runtime errors

### Performance Issues
- Enable Vercel Analytics to monitor performance
- Check Build Cache settings in Vercel project settings
- Consider optimizing TanStack Start routes and components

## Architecture

This is a full-stack TanStack Start application:
- **Frontend**: React 19 with TanStack Router
- **Backend**: Node.js with TanStack Start server runtime
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI + Tailwind CSS

Vercel handles both the frontend build and the Node.js backend runtime.

## Next Steps

If you want to keep using Cloudflare Workers:
1. Switch back to the `main` branch
2. Keep the existing `wrangler.jsonc` and Cloudflare configuration
3. Deploy to Cloudflare Pages instead

For pure Node.js on Vercel, continue using this branch.
