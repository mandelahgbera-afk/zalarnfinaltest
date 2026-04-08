# Salarn - Setup & Deployment Guide

## Quick Setup (5 minutes)

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Name it "salarn-prod" and select your region (closest to your users)
3. Wait for project initialization (~2 minutes)
4. Go to **Project Settings** → **API**
5. Copy your credentials:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Key** (VITE_SUPABASE_ANON_KEY)

### 2. Database Migration

1. In Supabase, go to **SQL Editor** → **New Query**
2. Copy entire content from `scripts/supabase-schema.sql`
3. Paste into the SQL editor
4. Click **Run** (green button)
5. Wait for completion (should see 9 tables created)

### 3. Create First Admin User

In Supabase SQL Editor:
```sql
INSERT INTO users (email, full_name, role, created_at)
VALUES ('admin@salarn.com', 'Admin', 'admin', NOW());
```

Then set password via Supabase Auth dashboard:
1. Go to **Authentication** → **Users**
2. Find "admin@salarn.com"
3. Click the three-dot menu → **Reset Password**

### 4. Deploy to Vercel

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Salarn"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) and create account (free)
3. Click **New Project** → Import your GitHub repo
4. Configure environment variables in Vercel:
   - `VITE_SUPABASE_URL` = (from step 1)
   - `VITE_SUPABASE_ANON_KEY` = (from step 1)
5. Click **Deploy**

## Environment Variables Reference

Create `.env.local` for local development:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**WARNING:** Never commit `.env.local` to git (it's in .gitignore)

## Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── pages/              # User & admin pages
├── components/         # React components
├── lib/               # Utilities & context
├── api/               # Database & auth clients
└── main.tsx           # Entry point

scripts/
└── supabase-schema.sql  # Database schema
```

## Admin Access

- Login with: `admin@salarn.com` (password set in Supabase)
- Access admin dashboard at: `/admin`

## Troubleshooting

**"Supabase credentials not found"**
- Check `.env.local` has correct values
- Restart dev server after changing env vars

**"RLS policy violation"**
- Ensure database migration ran successfully
- Check RLS policies exist in Supabase SQL Editor

**"Blank page on deploy"**
- Check Vercel build logs
- Ensure environment variables are set in Vercel project settings
- Clear browser cache

## Production Checklist

- [ ] Database migrated to Supabase
- [ ] Admin user created
- [ ] GitHub repo created & code pushed
- [ ] Vercel project created
- [ ] Environment variables set in Vercel
- [ ] Deploy successful
- [ ] Test login works
- [ ] Test admin dashboard loads
- [ ] Test user dashboard loads

## Support

For issues, check the GitHub issues or contact support.
