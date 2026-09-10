# Ajaia Docs

A lightweight collaborative document editor inspired by Google Docs.

## Features

- Mocked user login using seeded users
- Create and edit documents
- Rich-text editing with Tiptap
- Persistent document titles and content
- Save status indicator
- Document sharing between users
- Shared users can edit documents
- PostgreSQL persistence through Supabase
- API authorization for document access

## Tech Stack

- Next.js 16
- TypeScript
- App Router
- Tailwind CSS
- Tiptap
- Prisma 6
- PostgreSQL
- Supabase
- Vitest tooling

## Local Setup

```bash
npm install
npm run dev
```

### Create a `.env` file containing:

```env
DATABASE\_URL="your-pooled-database-url"
DIRECT\_URL="your-direct-database-url"
```

### Run database migrations:

```bash
npx prisma migrate dev
```

### Seed the database:

```bash
npx tsx prisma/seed.ts
```

### Open:

```bash
http://localhost:3000
```

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── documents/
│   │   └── users/
│   ├── dashboard/
│   │   └── documents/[id]/
│   └── page.tsx
└── lib/
    └── prisma.ts
```


## Authentication Note

Authentication is intentionally mocked for this assignment. Users select one of the seeded accounts, and the selected user is stored in localStorage. Password authentication and OAuth are outside the current scope.

## Collaboration Note

Shared users receive edit access. Real-time collaboration, comments, version history, and conflict resolution are outside the current scope.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```


