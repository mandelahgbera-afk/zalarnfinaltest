# SALARN - Production Deployment Guide

## Quick Start (5 Minutes)

### 1. Supabase Setup
1. Create account at supabase.com
2. Create new project
3. Go to SQL Editor
4. Copy entire contents of `/scripts/supabase-schema.sql`
5. Paste and execute
6. Done! Schema, RLS, and seed data installed

### 2. Create First Admin User
1. Go to Supabase Auth Users
2. Create new user with email (e.g., admin@example.com)
3. Go to SQL Editor, run:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';
```

### 3. Get API Keys
1. Go to Supabase Project Settings
2. Copy: Project URL → `VITE_SUPABASE_URL`
3. Copy: Anon Key → `VITE_SUPABASE_ANON_KEY`

### 4. Local Testing
```bash
# Install dependencies
pnpm install

# Create .env file with:
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# Start dev server
pnpm dev

# Login as admin@example.com
# Access /admin dashboard
```

### 5. Deploy to Vercel
1. Push code to GitHub
2. Create new project on vercel.com
3. Select GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

---

## Testing Both Roles

### Admin User
1. Login as `admin@example.com`
2. Navigate to `/admin` (in navbar)
3. Can access:
   - Admin Dashboard: Users, pending transactions, analytics
   - Manage Users: Toggle role, suspend accounts
   - Manage Cryptos: Add/edit prices
   - Manage Traders: Approve traders
   - View All Transactions: Approve/reject
   - Platform Settings: Configure system

### Regular User
1. Create account or login as user@example.com
2. Dashboard shows:
   - Balance (with hide toggle)
   - Portfolio holdings
   - Recent transactions
3. Can access:
   - Portfolio: See holdings with P&L
   - Trade: Buy/sell crypto
   - Copy Trading: Follow approved traders
   - Transactions: Deposit/withdraw
   - Settings: User preferences

---

## Features Verification

**User Features:**
- ✓ Sign up / Login / Logout
- ✓ Dashboard with balance, portfolio, transactions
- ✓ Portfolio management with P&L per coin
- ✓ Trade page (buy/sell orders)
- ✓ Copy trading with trader management
- ✓ Deposit/Withdrawal requests
- ✓ User settings

**Admin Features:**
- ✓ Admin dashboard with analytics
- ✓ User management (role toggle, suspend)
- ✓ Cryptocurrency management
- ✓ Trader approval and management
- ✓ Transaction approval/rejection
- ✓ Platform settings/configuration

---

## Database Roles

**Users Table:**
- Regular user can see only own profile
- Admin can see and edit all users

**User Balances:**
- Regular user can see only own balance
- Admin can see all balances

**Transactions:**
- Regular user creates transaction (type: deposit/withdrawal/buy/sell)
- Status: pending (awaiting admin approval)
- Admin can approve → approved / reject → rejected
- User can only see own transactions

**Portfolio:**
- Updated when transactions approved
- User sees only own holdings
- Admin sees all holdings

---

## Troubleshooting

**"Missing Supabase environment variables"**
- Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Verify .env file in project root

**"Admin access required"**
- Login as admin user
- Verify role='admin' in users table via SQL:
  ```sql
  SELECT email, role FROM public.users WHERE email='your@email.com';
  ```

**"Transaction not appearing"**
- Check RLS policies enabled in Supabase
- Run: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename='transactions';`
- Should show: rowsecurity = ON

**Build errors on Vercel**
- Verify env vars are set in Vercel project settings
- Check `npm run build` succeeds locally
- Ensure Node.js 18+ selected in Vercel settings

---

## Production Checklist

- [ ] Supabase project created
- [ ] Schema imported (scripts/supabase-schema.sql)
- [ ] RLS enabled on all tables
- [ ] Admin user created
- [ ] Environment variables configured
- [ ] GitHub repository pushed
- [ ] Vercel project created and deployed
- [ ] Admin dashboard accessible
- [ ] User features tested
- [ ] Transactions flow tested (create → approve/reject)
- [ ] Copy trading tested
- [ ] All navigation working

---

For technical audit details, see: AUDIT_COMPLETE.txt
