# Headless RBAC MVP (Laravel API + Next.js)

A headless MVC MVP using:

- **Laravel** (API-first backend)
- **Next.js** (frontend)
- **Sanctum** (SPA authentication)
- **Spatie Permission** (RBAC: roles/permissions)
- **Redis-ready caching** (for list endpoints)

---

## Project Structure

- `laravel-app/` → Laravel REST API
- `nextjs-app/` → Next.js frontend app

---

## MVP Features

- Authentication:
  - Login
  - Logout
- User Management (Admin only):
  - List users
  - Create user
  - Edit user
  - Delete user
  - Assign roles
- Roles:
  - `admin`
  - `manager`
- Async side effects:
  - User-created email is handled via **Event/Listener** (queued), not blocking API response
- UI improvements:
  - Route-based screens (`/users`, `/users/create`, `/users/:id/edit`)
  - Toast notifications
  - Shadcn-style confirmation modal for delete
  - Global loading spinner for API requests and route transitions

---

## Security & API Design

- API-first REST design
- Form Request validation
- API Resources for controlled response payloads
- Sanctum SPA auth with stateful cookies + CSRF protection
- RBAC middleware (`role`, `permission`, `role_or_permission`)
- Rate limiting on auth/protected endpoints
- CORS configured for local frontend/backend setup
- User list endpoint caching with invalidation on create/update/delete

---

## Local Environment

- Backend: `http://localhost:8001`
- Frontend: `http://localhost:3000`

---

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- npm
- MySQL (or PostgreSQL)
- Redis (optional but recommended for cache/queue)

---

## Installation

### 1) Clone and install dependencies

```bash
cd /path/to/laravel-nextjs-app

# Laravel
cd laravel-app
composer install

# Next.js
cd ../nextjs-app
npm install
```

### 2) Configure Laravel app

```bash
cd /path/to/laravel-nextjs-app/laravel-app
cp .env.example .env
php artisan key:generate
```

Update `.env` (DB, app URL, sanctum/cors/session, cache/queue as needed), then:

```bash
php artisan migrate --seed
```

### 3) Configure Next.js app

```bash
cd /path/to/laravel-nextjs-app/nextjs-app
cp .env.example .env.local
```

Set frontend env values (example):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_SKIP_EMAIL_VERIFICATION_LOCAL=true
```

---

## Run the Apps

### Backend (Laravel API)

```bash
cd /path/to/laravel-nextjs-app/laravel-app
php artisan serve --port=8001
```

### Queue Worker (for async email/event listeners)

```bash
cd /path/to/laravel-nextjs-app/laravel-app
php artisan queue:work
```

### Frontend (Next.js)

```bash
cd /path/to/laravel-nextjs-app/nextjs-app
npm run dev
```

---

## Default Role Notes

- Seeded roles include:
  - `admin`
  - `manager`
- Only `admin` can access user CRUD in MVP flow.

---

## API Notes (MVP)

Protected via Sanctum + RBAC:

- `GET /api/users`
- `POST /api/users`
- `GET /api/users/{id}`
- `PUT/PATCH /api/users/{id}`
- `DELETE /api/users/{id}`

Auth routes are available for login/logout and session-based SPA auth.

---

## SMTP / Local Mail Behavior

Email sending is asynchronous through queue listener.  
In localhost without SMTP, user creation should not fail due to email send failure.

---

## Development Tips

- Clear caches if config changes:
  ```bash
  php artisan optimize:clear
  ```
- Re-seed roles/users if needed:
  ```bash
  php artisan db:seed
  ```
- Frontend lint:
  ```bash
  cd /path/to/laravel-nextjs-app/nextjs-app
  npm run lint
  ```
