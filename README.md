<div align="center">

# Bookreq

> A polished reading companion for tracking books, discovering authors, and managing a personal library — with a dedicated admin workspace for the whole platform.

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-111111?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

## Overview

Bookreq is a full-stack library platform designed around a calm, intentional reading experience. Readers can organize personal libraries, monitor reading progress, and keep their book collection in one place. Administrators get a secure command center to manage users, books, and authors across the platform.

The project emphasizes a premium interface, responsive interactions, typed APIs, and role-based access control.

## Highlights

### Reader experience

- Build and organize a personal reading library.
- Track each book as **Want to Read**, **Reading**, or **Completed**.
- Browse book and author information in a focused, responsive interface.
- Maintain a personal profile and account session.

### Admin workspace

- Live overview of total users, books, and authors.
- Recent book activity and recently registered users.
- Searchable, filterable, paginated book management.
- Searchable, filterable, paginated user management.
- Author catalogue with book counts, search, pagination, and author creation.
- Role-aware navigation: administrative catalogue access is shown only to admins.

### Product details

- Responsive layouts for desktop and mobile.
- Outside-click and `Escape` support for navigation menus.
- Loading skeletons, empty states, inline errors, and toast feedback.
- Optimistic UI update after author creation.
- External cover and profile images rendered with Next Image.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS, Lucide icons |
| API client | Axios |
| Notifications | Sonner |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Authentication | Session-based authentication with role support |

## Application areas

```text
/
├── Landing page
├── /dashboard
│   └── Reader workspace
├── /dashboard/books
│   └── Personal library
├── /profile
│   └── Reader profile
└── /admin
    ├── Dashboard overview
    ├── /admin/users
    ├── /admin/books
    └── /admin/authors
```

## Role-based access

Bookreq separates reader and administrator experiences.

| Capability | Reader | Admin |
|---|:---:|:---:|
| Manage personal reading library | Yes | Yes |
| View profile | Yes | Yes |
| View admin dashboard | No | Yes |
| Manage platform users | No | Yes |
| Review all books | No | Yes |
| Manage author catalogue | No | Yes |

> Hiding an admin link in the UI improves navigation clarity, but it is not security. Protected API routes and admin pages must also verify authorization on the server.

## API endpoints

### Admin

```http
GET  /api/admin/dashboard
GET  /api/admin/users?page=1&limit=10&search=&role=
GET  /api/admin/books?page=1&limit=10&search=&status=
GET  /api/admin/authors?page=1&limit=10&search=
POST /api/admin/authors
```

### Create an author

```http
POST /api/admin/authors
Content-Type: application/json

{
  "name": "Haruki Murakami",
  "bio": "Japanese novelist, short-story writer, and translator."
}
```

## Environment variables

### Frontend — `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend — `.env`

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

Add the authentication provider variables required by your chosen session/auth setup as well. Never commit real credentials.

## Local development

### 1. Clone and install

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

Install dependencies in both frontend and backend directories:

```bash
yarn install
```

### 2. Configure environment files

Create the frontend `.env.local` and backend `.env` files using the variables above.

### 3. Set up the database

From the backend directory:

```bash
yarn prisma migrate dev
yarn prisma generate
```

Optionally load seed data:

```bash
yarn prisma db seed
```

### 4. Start the application

Run the backend:

```bash
yarn dev
```

Run the frontend in a separate terminal:

```bash
yarn dev
```

Open the frontend at `http://localhost:3000`.

## Frontend API convention

The frontend uses a shared Axios client:

```ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

With `/api` included in `baseURL`, feature helpers remain concise:

```ts
apiClient.get('/admin/dashboard');
apiClient.get('/admin/users?page=1&limit=10');
apiClient.post('/admin/authors', payload);
```

## UI principles

- **Quiet confidence** — calm surfaces, intentional spacing, and readable hierarchy.
- **Fast feedback** — skeletons during loading and toast messages for completed actions.
- **Clear state** — empty, error, disabled, and pagination states are treated as first-class UI.
- **Responsive by default** — administrative tables preserve layout with horizontal scrolling where necessary.
- **Accessible interactions** — menus close on outside pointer interaction and the `Escape` key.

## Roadmap

- [ ] Edit author details.
- [ ] Delete authors with linked-book safeguards.
- [ ] Admin role promotion and demotion flow.
- [ ] Book moderation actions.
- [ ] Dashboard reading-status analytics.
- [ ] Author and book detail pages.
- [ ] Automated tests for API authorization and core UI flows.

## Project status

Actively under development. The admin dashboard, user management, book management, author catalogue, author creation flow, and responsive navigation foundation are in place.

---

Built for readers who want their library to feel as considered as the books inside it.

## Author

Built by **Najim Haq**.

- Live Client: [@vercel](https://github.com/najimhaq/bookreq-frontend)
- Live Server: [@render](https://bookreq-api.onrender.com/api/health)
- Portfolio: [najimul.com](https://najimul.com)
- GitHub: [@najimhaq](https://github.com/najimhaq)
