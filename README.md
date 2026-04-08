# Salarn - Crypto Trading Platform

Production-ready crypto trading platform with copy trading, admin dashboard, and role-based access control.

## Tech Stack
- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with JWT
- **Deployment**: Vercel
- **Styling**: Tailwind CSS v4 + Shadcn/UI

## Project Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd salarn
pnpm install
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Copy your Project URL and Anon Key

#### Run Database Schema
1. Go to Supabase SQL Editor
2. Copy entire contents of `/scripts/supabase-schema.sql`
3. Paste and execute in SQL editor
4. All tables, RLS policies, and triggers will be created

#### Enable RLS on All Tables
RLS is enabled in the schema. Verify in Supabase Dashboard → Authentication → Policies

#### Create First Admin User
```sql
-- In Supabase SQL Editor
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, created_at, updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('your_password', gen_salt('bf')),
  now(),
  now(),
  now()
)
RETURNING id;

-- Then insert user profile with returned auth id
INSERT INTO public.users (auth_id, email, full_name, role)
VALUES (
  '<returned-id>',
  'admin@example.com',
  'Admin User',
  'admin'
);
```

### 3. Environment Variables

Create `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server
```bash
pnpm dev
```

App runs at `http://localhost:5173`

## Vercel Deployment

### 1. Connect GitHub Repository
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your repository

### 2. Set Environment Variables
In Vercel Project Settings → Environment Variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### 3. Deploy
Vercel auto-deploys on git push. Build settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Features

### User Features
- **Authentication**: Email/password signup and login
- **Dashboard**: Portfolio overview, account balance, recent transactions
- **Portfolio**: View crypto holdings with P&L calculation
- **Trade**: Buy/sell cryptocurrencies (admin approval required)
- **Transactions**: Deposit/withdrawal requests with status tracking
- **Copy Trading**: Follow approved traders and auto-copy trades
- **Settings**: Update profile and security settings

### Admin Features
- **Admin Dashboard**: Platform analytics, user count, pending transactions
- **Manage Users**: View all users, change roles, suspend/activate accounts
- **Manage Cryptos**: Add/edit cryptocurrencies and prices
- **Manage Traders**: Approve/reject copy traders
- **Admin Transactions**: Approve or reject deposits/withdrawals
- **Platform Settings**: Configure platform parameters

## Database Schema

### Key Tables
- `users`: User profiles with role (user/admin)
- `user_balances`: Account balances and P&L
- `cryptocurrencies`: Available cryptos for trading
- `portfolio`: User holdings
- `transactions`: All transactions (deposit/withdraw/buy/sell)
- `copy_trades`: Active copy trading relationships
- `copy_traders`: Approved traders available for copying
- `platform_settings`: Key-value config store
- `email_notifications`: Email audit log

### Row Level Security (RLS)
All tables have RLS enabled:
- Users see only their own data (except admins)
- Admins see all data
- Cryptocurrencies: Public read, admin write
- Policies enforce complete data isolation

## Testing

### Login Flow
1. Sign up with email/password
2. Regular users land on `/dashboard`
3. Admins land on `/admin`
4. Non-admins accessing `/admin/*` get 404

### Admin Functions
- Approve transactions in Admin Transactions
- Toggle user roles in Manage Users
- Add cryptos in Manage Cryptos
- Configure settings in Platform Settings

### RLS Verification
SQL query to test user data isolation:
```sql
-- Set JWT token to user's email
SELECT auth_email();  -- Returns current user's email
SELECT * FROM portfolio;  -- Returns only their portfolio
```

## Development

### TypeScript Compilation
```bash
pnpm typecheck
```

### Build
```bash
pnpm build  # Creates dist/ folder
pnpm preview  # Test production build locally
```

## Troubleshooting

**"Missing Supabase environment variables"**
- Ensure `.env.local` has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

**RLS Policy Errors**
- Execute entire schema SQL in Supabase SQL Editor
- Verify RLS is enabled on all tables

**Users can't be promoted to admin**
- Ensure admin user exists with role='admin' in users table
- Check that RLS policies allow admin updates

**Transactions always show "pending"**
- Admin must approve in Admin Transactions page
- Check transaction status in Supabase dashboard

## Architecture

### Authentication
- Supabase Auth manages login/signup
- JWT tokens stored in localStorage
- AuthContext syncs auth state across app

### Authorization
- Frontend: `useAuth()` hook checks `isAdmin` and redirects
- Backend: RLS policies enforce role-based access
- Dual verification prevents unauthorized access

### Data Flow
1. User action (e.g., create transaction)
2. Frontend calls Supabase client
3. RLS policy evaluates JWT claims
4. Only authorized data returned
5. UI updates with fresh data

## Production Checklist
- [ ] Supabase RLS enabled on all tables
- [ ] First admin user created
- [ ] Environment variables set in Vercel
- [ ] Build succeeds with `pnpm build`
- [ ] No TypeScript errors
- [ ] Tested login and admin redirect
- [ ] Tested data isolation with SQL queries
- [ ] Deployed to Vercel and tested live
