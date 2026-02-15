# NextAuth.js Setup Guide

## ✅ What Has Been Implemented

### 1. Authentication System
- ✅ NextAuth.js installed and configured
- ✅ Google OAuth Provider integrated
- ✅ Prisma Adapter for database sessions
- ✅ Session management with user ID

### 2. Database Schema Updates
- ✅ User model (with email, name, image)
- ✅ Account model (OAuth provider data)
- ✅ Session model (session tokens)
- ✅ VerificationToken model
- ✅ Transaction model updated with `userId` foreign key
- ✅ BudgetConfig model updated with `userId` foreign key

### 3. Route Protection
- ✅ Middleware created to protect `/dashboard` and `/api` routes
- ✅ Only authenticated users can access protected routes
- ✅ Automatic redirect to landing page for unauthorized users

### 4. API Updates
- ✅ All transaction APIs filter by logged-in user
- ✅ Budget config APIs filter by logged-in user
- ✅ Proper authorization checks on all endpoints

### 5. UI Components
- ✅ Landing page with "Sign in with Google" button
- ✅ Dashboard moved to `/dashboard` route
- ✅ Header updated with user profile and logout button
- ✅ SessionProvider added to app

## 🔧 Required Setup Steps

### Step 1: Set Up Google OAuth

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Click "New Project" or select existing one

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure OAuth consent screen:
     - User Type: External
     - App name: Monthly Budget Planner
     - User support email: your email
     - Developer contact: your email
     - Click "Save and Continue" through the steps
   
5. **Configure OAuth Client**
   - Application type: Web application
   - Name: Monthly Budget Planner
   - Authorized JavaScript origins:
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
   - Click "Create"

6. **Copy Credentials**
   - Copy the **Client ID** and **Client Secret**
   - Keep these secure!

### Step 2: Update Environment Variables

Edit your `.env` file and replace the placeholders:

```env
# Generate a secret using: openssl rand -base64 32
NEXTAUTH_SECRET="paste-your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Paste your Google credentials here
GOOGLE_CLIENT_ID="your-actual-client-id-from-google-cloud"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-from-google-cloud"
```

**Generate NEXTAUTH_SECRET:**
- Windows PowerShell: `openssl rand -base64 32`
- Or use an online generator: https://generate-secret.vercel.app/32

### Step 3: Update Database Schema

**IMPORTANT:** Close your dev server if running, then:

```bash
# Generate new Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push
```

This will:
- Create the User, Account, Session, and VerificationToken tables
- Add userId columns to Transaction and BudgetConfig tables
- **WARNING:** Existing data will lose user associations

### Step 4: Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🎯 How It Works

### Authentication Flow

1. **User visits** `/` (Landing Page)
   - Sees "Sign in with Google" button
   - Not authenticated, cannot access dashboard

2. **User clicks "Sign in with Google"**
   - Redirected to Google OAuth consent screen
   - User authorizes the app
   - Google redirects back to `/api/auth/callback/google`
   - NextAuth creates/updates user in database
   - Session is created

3. **User is redirected to** `/dashboard`
   - Now authenticated
   - Can see their personal budget data
   - Header shows profile picture and logout button

4. **API Requests**
   - Middleware checks authentication
   - APIs filter data by `session.user.id`
   - Each user sees only their own data

### User Isolation

- ✅ Each user has their own transactions
- ✅ Each user has their own budget configurations
- ✅ Data is filtered by `userId` in all queries
- ✅ No user can see another user's data

## 🚨 Troubleshooting

### "Unauthorized" errors in API
- Make sure you're signed in
- Check that `NEXTAUTH_SECRET` is set
- Clear cookies and sign in again

### "Cannot read properties of null" error
- Run `npm run db:generate` again
- Make sure database migrations are complete

### Redirect loop
- Check that `NEXTAUTH_URL` matches your actual URL
- In production, set it to your domain

### Google OAuth error
- Verify redirect URI in Google Cloud Console matches exactly
- Check that Client ID and Secret are correct
- Make sure Google+ API is enabled

## 📝 Testing Checklist

- [ ] Visit `/` - Should see landing page
- [ ] Click "Sign in with Google" - Should redirect to Google
- [ ] Authorize app - Should redirect to `/dashboard`
- [ ] See user profile in header
- [ ] Add a transaction - Should save with your userId
- [ ] Logout - Should redirect to landing page
- [ ] Try to visit `/dashboard` while logged out - Should redirect to `/`

## 🚀 Production Deployment

When deploying to production (Vercel, etc.):

1. Add environment variables in hosting platform
2. Update `NEXTAUTH_URL` to your production domain
3. Add production URL to Google OAuth authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
4. Run database migrations with `npm run db:migrate`

## 📦 Files Changed

- ✅ `prisma/schema.prisma` - Added auth models
- ✅ `src/lib/auth.ts` - NextAuth configuration
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - Auth API route
- ✅ `src/middleware.ts` - Route protection
- ✅ `src/app/page.tsx` - Landing page
- ✅ `src/app/dashboard/page.tsx` - Protected dashboard
- ✅ `src/components/Header.tsx` - Added logout button
- ✅ `src/app/providers.tsx` - Added SessionProvider
- ✅ `src/app/api/transactions/route.ts` - User filtering
- ✅ `src/app/api/budget-config/route.ts` - User filtering
- ✅ `README.md` - Updated documentation
- ✅ `.env.example` - Added auth variables
