This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database Setup (PostgreSQL + Prisma)

1. Create a PostgreSQL database and add a `.env` file (copy from `.env.example`):

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/monthly_budget"
   ```

2. Generate the Prisma client, push the schema, and seed the database:

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

   Or use migrations for production:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

   **Note:** The seed script requires `tsx`. Install it with `npm install -D tsx` if not already present.

3. API routes:
   - `GET /api/transactions` – fetch all transactions (optional query: `?month=3&year=2025&type=EXPENSE`)
   - `POST /api/transactions` – create a transaction (body: `{ date, description, amount, category, type }`)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
