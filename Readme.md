# KRISTBALL - Military Asset Management

A small full-stack assignment with a TypeScript + Express backend (Prisma + PostgreSQL) and a React + Vite frontend.

## Quick summary
- Backend: [backend](backend) runs on port `8086` by default.
- Frontend: [frontend](frontend) runs on port `5173` by default.

## Prerequisites
- Node.js (v18+ recommended)
- npm (or pnpm/yarn)
- PostgreSQL running locally

## Backend setup (recommended order)
1. Open a terminal and go to the backend folder:

   ```bash
   cd backend
   npm install
   ```

2. Configure the database connection. The project ships with a default connection string in `backend/prisma/schema.prisma`:

   ```text
   postgresql://postgres:9199@localhost:5432/military_asset_management_db
   ```

   - Option A (easiest): Create a PostgreSQL database and user that match that connection string.
   - Option B: Update the `url` in `backend/prisma/schema.prisma` to match your environment.

3. Apply the migrations and generate the Prisma client:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

   If you prefer, `npx prisma db push` will also create the schema without using migrations.

4. (Optional) Seed data: there is no automated seed file committed. To create a demo admin user and base manually, run these SQL commands against your DB (replace ids or values as needed):

   ```sql
   INSERT INTO "Base" ("id","name","location","baseCode") VALUES ('base-1','Demo Base','Demo Location','BASE1');
   INSERT INTO "User" ("id","name","email","hashedPassword","role","baseId") VALUES ('user-1','Admin','admin@example.com','password','ADMIN','base-1');
   ```

   - Login will accept the plain password stored in `hashedPassword` (the current demo login compares plaintext).

5. Set the required environment variable for JWT signing (example):

   ```bash
   set JWT_SECRET_KEY=your_secret_here   # Windows (cmd)
   $env:JWT_SECRET_KEY='your_secret_here' # PowerShell
   export JWT_SECRET_KEY=your_secret_here # Linux/macOS
   ```

6. Build and run the backend:

   ```bash
   npm run build
   npm run dev
   ```

   - The server logs `✅ Database connected` and `🚀 Server running on port 8086` when ready.

Alternative for development (skip build):

```bash
npx ts-node-dev src/index.ts
```

## Frontend setup
1. Open a new terminal, go to the frontend folder:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Open the app in the browser at `http://localhost:5173` (Vite default).
3. Use the demo credentials above (e.g., `admin@example.com` / `password`) to log in if you inserted them.

## Testing & verification checklist for evaluator
- Ensure PostgreSQL is running and the schema is applied (`npx prisma migrate deploy` or `npx prisma db push`).
- Start the backend (`npm run build && npm run dev`) and confirm `Database connected` in logs.
- Start the frontend (`npm run dev`) and open `http://localhost:5173`.
- Log in with the demo user (created with SQL) and exercise pages: Dashboard, Assignments, Purchases, Transfers.

## Troubleshooting
- If the backend fails to connect to the DB: check the connection string in `backend/prisma/schema.prisma` and ensure the DB exists and accepts the credentials.
- If login fails: confirm a user exists in the `User` table and that `hashedPassword` matches the password you enter (plaintext for demo).
- If CORS errors appear: frontend expects backend on `http://localhost:8086` and Vite on `http://localhost:5173` (see `backend/src/index.ts` CORS allowed origins).

## Notes for graders
- No custom seed script is committed. If you prefer, insert the demo data using the SQL snippet in the "Backend setup" section.
- The backend expects `JWT_SECRET_KEY` to be set for login token creation.


