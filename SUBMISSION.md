# Ajaia LLC AI-Native Full Stack Developer Assignment

## Candidate

Soumya Tiwari  
tiwarisoumya111@gmail.com

## Project

Ajaia Docs is a lightweight collaborative document editor inspired by Google Docs.

## Included Deliverables

- Source code
- `README.md` with setup and run instructions
- `SUBMISSION.md`
- Prisma schema and database seed
- Next.js App Router application
- REST API routes
- Tiptap document editor
- PostgreSQL persistence through Supabase
- Mocked user login using seeded users
- Document sharing and shared editing flow
- Production build verification

## Technology

- Next.js 16
- TypeScript
- App Router
- Tailwind CSS
- Tiptap
- Prisma 6
- PostgreSQL
- Supabase
- Vitest tooling

## Working Features

### Document Creation and Editing

- Users can select one of two seeded users.
- Users can create a new document.
- New documents open directly in the editor.
- Users can rename documents.
- Users can edit document content in the browser.
- Document titles and rich-text content are persisted in PostgreSQL.
- Documents can be closed and reopened.
- Refreshing the editor preserves saved content.
- The editor includes Tiptap rich-text support with StarterKit and underline support.
- The editor provides a save-status indicator.

### Sharing

- A document has an owner.
- The owner can share a document with another seeded user.
- Shared users can open the document.
- Shared users can edit the document.
- Changes made by a shared user are persisted and visible to the owner.
- Users without access cannot retrieve the document through the document API.
- The current scope gives shared users edit access.

### Persistence

- Documents are stored in PostgreSQL hosted on Supabase.
- Document content is stored as JSON.
- Sharing relationships are stored using Prisma.
- Documents remain available after refresh.
- Rich-text document structure is preserved.

## Seeded Review Accounts

Authentication is intentionally mocked for this assignment.

The available seeded users are:

- Soumya Tiwari
- Alex Morgan

No passwords are required. Select a user from the initial login screen.

## How to Run Locally

Install dependencies:

```bash
npm install
```

### Create a `.env` file:

```env
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"
```

### Run migrations:

```bash
npx prisma migrate dev
```

### Seed the database:

```bash
npx tsx prisma/seed.ts
```

### Start the development server:

```bash
npm run dev
```

### Open:

```text
http://localhost:3000
```

## Verification Commands

The following commands pass locally:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Review Walkthrough

Suggested review flow:

1. Select Soumya Tiwari.
2. Create a new document.
3. Enter a title and document content.
4. Save the document.
5. Refresh or return to the dashboard.
6. Reopen the document and confirm persistence.
7. Share the document with Alex Morgan.
8. Return to the login screen and select Alex Morgan.
9. Open the shared document.
10. Edit and save the document.
11. Return as Soumya and confirm the shared edit is persisted.

## Live Product

Live URL:

```text
PASTE_LIVE_DEPLOYMENT_URL_HERE
```

The project is currently configured for deployment through Vercel with Supabase as the PostgreSQL provider.

## Walkthrough Video

Video URL:

```text
PASTE_UNLISTED_YOUTUBE_OR_LOOM_URL_HERE
```

## Architecture Summary

The application uses the Next.js App Router. The dashboard displays documents available to the current mocked user. Document API routes use the `x-user-id` request header to identify the current seeded user.

Prisma provides database access through a shared helper in `src/lib/prisma.ts`. PostgreSQL stores users, documents, document content, and document-sharing relationships.

Tiptap stores editor content as JSON in the `Document.content` field. The document-specific API route handles loading and updating a document. Access is granted to either the document owner or a user listed in the document-sharing table.

The application intentionally uses mocked authentication so the implementation can focus on document workflows, persistence, sharing, and authorization within the assignment timebox.

## AI Workflow Note

AI assistance was used to accelerate project scaffolding, API implementation, debugging, and documentation.

AI was especially useful for:

- Generating initial route and component structure
- Drafting Prisma and API patterns
- Identifying Next.js dynamic route conventions
- Debugging hydration and React effect issues
- Suggesting validation and authorization checks
- Improving error handling and implementation speed

AI-generated code was reviewed, adapted, and tested manually. Several suggestions were changed during implementation, especially around React hydration, state initialization, effect dependencies, and nullable Tiptap editor types.

Correctness was verified using:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The main user flows were also tested manually in the browser, including document creation, editing, refresh persistence, sharing, and shared-user editing.

## Known Limitations

The following items were intentionally limited or not completed within the assignment timebox:

- Authentication is mocked; there are no passwords, sessions, OAuth, or production authentication.
- There is no real-time collaboration or conflict resolution.
- Shared users currently receive edit access; view-only permissions are not implemented.
- A visible formatting toolbar was not completed.
- The editor uses Tiptap's rich-text foundation, but formatting controls such as bold, italic, headings, and lists are not exposed through a finished toolbar.
- File upload and `.txt`/`.md` import were not completed.
- Automated authorization tests were not completed.
- Comments, version history, and presence indicators are not implemented.
- Deployment URL must be added before final submission if deployment is completed.

## What I Would Build Next

With another 2–4 hours, I would prioritize:

1. Add `.txt` and `.md` import with clear supported-file validation.
2. Add a formatting toolbar for bold, italic, underline, headings, bullet lists, and numbered lists.
3. Add automated API tests covering owner access, shared access, and unauthorized access.
4. Add shared-document grouping on the dashboard.
5. Add view-only and edit permissions.
6. Deploy to Vercel and verify the production Supabase connection.

## Product Tradeoffs

I prioritized a complete document lifecycle and sharing workflow over breadth. The implemented slice supports creating, editing, saving, reopening, sharing, and editing shared documents with persistent database storage.

File import, production authentication, real-time collaboration, and advanced editor features were intentionally deferred so the core workflow could be implemented and verified within the timebox.
```
