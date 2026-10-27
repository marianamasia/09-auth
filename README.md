# NoteHub — authentication

Next.js App Router, TypeScript, Axios, TanStack Query and Zustand.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Use `NEXT_PUBLIC_API_URL=http://localhost:3000` locally. This is the URL of this Next.js application, not the upstream backend. The application forwards requests through the supplied `app/api` routes to `https://notehub-api.goit.study`. The previous public NoteHub token is not used.

## Features

- Registration, login, logout and cookie session restoration.
- Protected `/notes` and `/profile` routes and guest-only sign-in/sign-up pages.
- Server-rendered profile and client-side username editing.
- Notes with search, tag filters, pagination, modal previews and persistent drafts.
- Request-specific server cookie forwarding and cookie refresh in `proxy.ts`.
- Authentication state in Zustand; tokens remain in cookies. Query cache and drafts are cleared on logout.

The route groups `(auth routes)` and `(private routes)` do not appear in URLs. The modal slot lives at `app/@modal` and is rendered by the root layout. Its intercepted note page checks authentication before loading data.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## Vercel

Import the `09-auth` repository as a Next.js project. Set `NEXT_PUBLIC_API_URL` to the production site origin (for example, `https://your-project.vercel.app`, without `/api`), then deploy or redeploy. If using preview deployments, configure the variable for that preview origin too so requests and cookies stay on the same site. Do not reuse the URL of an earlier homework project.

The same variable is used for page metadata. No source edits are needed after deployment.

The supplied `app/api` files from the course are preserved unchanged.
