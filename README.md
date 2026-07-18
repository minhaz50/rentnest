# RentNest 🏠

Backend API for a rental property marketplace — tenants browse & request
rentals, landlords manage listings, admins moderate the platform.

## Tech Stack

- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM (multi-file schema)
- JWT authentication
- Stripe & SSLCommerz for payments

## Project Structure

```
prisma/
  schema/          # multi-file Prisma schema
    schema.prisma  # generator + datasource
    enums.prisma
    user.prisma
    category.prisma
    property.prisma
    rental.prisma
    payment.prisma
    review.prisma
  seed.ts
prisma.config.ts    # tells Prisma where the schema folder is
src/
  config/           # reads .env into one object
  lib/
    prisma.ts       # shared Prisma Client instance
  middleware/
    auth.ts         # authenticate + authorize
    errorHandler.ts
  modules/
    auth/           # register, login, me
    user/           # admin: manage users
    category/       # property categories
    property/       # listings (public, landlord, admin)
    rental/         # rental requests (tenant, landlord, admin)
    payment/        # Stripe + SSLCommerz payments
    review/         # tenant reviews
    (each module has: *.controller.ts, *.interface.ts, *.routes.ts, *.service.ts)
  utils/
  app.ts
  server.ts
```

Each module follows the same simple pattern:
- **interface** – the shape of the data coming in
- **service** – talks to the database (Prisma) and holds the business rules
- **controller** – reads the request, calls the service, sends the response
- **routes** – wires URLs to controllers

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Copy the example env file and fill in your own values
   ```bash
   cp .env.example .env
   ```

3. Create the database tables
   ```bash
   npm run prisma:migrate
   ```

4. (Optional) Seed default categories + an admin account
   ```bash
   npm run prisma:seed
   ```
   Default admin: `admin@rentnest.com` / `Admin@123`

5. Start the dev server
   ```bash
   npm run dev
   ```

The API will run at `http://localhost:5000`.

## Auth

Send the JWT you get from `/api/auth/login` or `/api/auth/register` as:
```
Authorization: Bearer <token>
```

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| PATCH | /api/auth/me | Logged in |

### Properties (Public)
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/properties | Public |
| GET | /api/properties/:id | Public |
| GET | /api/categories | Public |

### Landlord
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/landlord/properties | Landlord |
| POST | /api/landlord/properties | Landlord |
| PUT | /api/landlord/properties/:id | Landlord |
| DELETE | /api/landlord/properties/:id | Landlord |
| GET | /api/landlord/requests | Landlord |
| PATCH | /api/landlord/requests/:id | Landlord (body: `{ "status": "APPROVED" \| "REJECTED" \| "COMPLETED" }`) |

### Rental Requests
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/rentals | Tenant |
| GET | /api/rentals | Tenant |
| GET | /api/rentals/:id | Tenant / Landlord / Admin |

### Payments
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/payments/create | Logged in |
| POST | /api/payments/confirm | Logged in |
| GET | /api/payments | Logged in |
| GET | /api/payments/:id | Logged in |
| POST | /api/payments/stripe/webhook | Stripe |
| POST | /api/payments/sslcommerz/success \| fail \| cancel | SSLCommerz |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/reviews | Tenant |

### Admin
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/admin/users | Admin |
| PATCH | /api/admin/users/:id/status | Admin |
| GET | /api/admin/properties | Admin |
| GET | /api/admin/rentals | Admin |
| POST / PUT / DELETE | /api/categories | Admin |

## Rental Request Lifecycle

```
PENDING → APPROVED → (payment) → ACTIVE → COMPLETED
       ↘ REJECTED
```
