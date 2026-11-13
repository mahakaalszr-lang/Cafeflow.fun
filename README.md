# CafeFlow Clone

Independent restaurant-operations SaaS implementation inspired by publicly observable hospitality workflows. Not affiliated with CafeFlow and does not reuse private source code or private APIs.

## Stack
- Next.js 14 / React / TypeScript / Tailwind
- PostgreSQL + Prisma
- Signed HTTP-only cookie sessions + bcrypt password hashing
- Zod request validation
- Razorpay order creation and signature verification

## Local setup
1. Install Node.js 20+ and PostgreSQL.
2. Copy `.env.example` to `.env`; set `DATABASE_URL` and a random `AUTH_SECRET` (32+ characters).
3. Run:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run dev
   ```
4. Open http://localhost:3000.

## API overview
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Menu: `GET/POST /api/menu`, `GET/POST /api/menu/categories`
- Orders: `GET/POST /api/orders`, `PATCH /api/orders/:id`
- Inventory: `GET/POST /api/inventory`, `POST /api/inventory/:id/adjust`
- Customers, reservations, tables: `/api/customers`, `/api/reservations`, `/api/tables`
- Kitchen, dashboard, analytics, staff: `/api/kitchen`, `/api/dashboard`, `/api/analytics`, `/api/staff`
- Public QR ordering: `GET /api/public/menu/:locationId`, `POST /api/public/orders`
- Razorpay: `POST /api/payments/razorpay/order`, `POST /api/payments/razorpay/verify`

## Production checklist
- Managed PostgreSQL, strong session secret, HTTPS and secure deployment variables.
- Razorpay test credentials first; live credentials only after merchant onboarding.
- Add rate limiting / bot protection to public QR ordering and auth.
- Add CSRF/origin protection, audit logs, backups, monitoring and integration tests.
- Verify tax, privacy, data-retention and payment compliance for your business.
- Configure a production database migration and deployment pipeline.

## Status
The dashboard currently displays sample values. Initial API routes and Prisma models have been added, but complete UI-to-API integration, security hardening, automated end-to-end testing, live payment credentials and deployment remain outstanding. Sample dashboard numbers are not real business records.
