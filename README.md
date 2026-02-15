This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- 🔐 **Google OAuth Authentication** - Secure login with NextAuth.js
- 📊 **Budget Tracking** - Track income, expenses, bills, debts, and savings
- 📈 **Visual Analytics** - Beautiful charts and graphs
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 💾 **PostgreSQL Database** - Reliable data storage with Prisma ORM

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- PostgreSQL installed and running
- A Google Cloud account (for OAuth)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd monthly-budget-planer
npm install
```

### 2. Database Setup (PostgreSQL + Prisma)

Create a PostgreSQL database and add a `.env` file (copy from `.env.example`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/monthly_budget"
```

Generate the Prisma client and push the schema:

```bash
npm run db:generate
npm run db:push
```

### 3. Google OAuth Setup

#### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

#### Step 2: Configure Environment Variables

Add the following to your `.env` file:

```env
# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Authentication Flow

- **Landing Page** (`/`) - Public page with "Sign in with Google" button
- **Dashboard** (`/dashboard`) - Protected route, requires authentication
- **API Routes** (`/api/*`) - Protected, only accessible by authenticated users

### Protected Routes

The following routes are protected by middleware:
- `/dashboard` - Main budget dashboard
- `/api/transactions` - Transaction API endpoints
- `/api/budget-config` - Budget configuration endpoints

## Database Schema

### User Model
- Google OAuth integration
- One-to-many relationship with Transactions and BudgetConfigs

### Transaction Model
- userId (foreign key to User)
- date, description, amount, category, type
- Types: INCOME, EXPENSE, BILL, DEBT, SAVING

### BudgetConfig Model
- userId (foreign key to User)
- month, year, category, targetAmount, type

## API Routes

All API routes require authentication:

- `GET /api/transactions?month=3&year=2025` – Fetch user's transactions
- `POST /api/transactions` – Create a new transaction
- `PATCH /api/transactions/[id]` – Update a transaction
- `GET /api/budget-config?month=3&year=2025` – Fetch user's budget config

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations (production)
- `npm run db:studio` - Open Prisma Studio

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with Google Provider
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **State Management:** SWR (for data fetching)
- **Icons:** Lucide React

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

### Deployment Checklist

1. Set environment variables in Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

2. Update Google OAuth authorized redirect URIs with your production URL

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
