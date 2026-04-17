# otom8 — how the site and app fit together

This file is duplicated in **`ap`** and **`otom8-site`** so the layout is documented on GitHub. On your machine you may also keep a richer copy at the **parent** folder: `Otom8/CLAUDE.md` (optional; not a git repo).

## Two repos, one product

| Folder | Role | What lives there | Production |
|--------|------|------------------|------------|
| **`ap/`** (this repo) | **App** | Forked Activepieces — flows, builder, pieces, Fastify API, Docker image | `app.otom8.us` (DigitalOcean) |
| **`otom8-site/`** | **Site** | Next.js — marketing pages, Clerk (`/login`, `/signout`), `/api/ap-sso`, `/admin` | `otom8.us` (Vercel) |

They are **sibling folders** (e.g. `Otom8/ap` and `Otom8/otom8-site`). The automation app is **not** inside the site repository.

## Typical local layout

```
Otom8/                          ← you open this in Cursor (often not a git root)
├── CLAUDE.md                   ← optional umbrella notes (local only unless you add a meta-repo)
├── README.md                   ← pointer to the two repos
├── ap/                         ← git: Activepieces fork
└── otom8-site/                 ← git: Next site + scripts
    ├── package.json            ← `pnpm dev` lives here
    ├── scripts/                ← starts ../ap/docker-compose.yml
    └── site/                   ← Next.js app (`site/` is the app directory)
```

## Run everything locally

From **`otom8-site/`** (not from `ap/`):

```bash
pnpm dev
```

That starts the AP Docker stack on **http://localhost:8080** and the site on **http://localhost:3000**. First-time SSO: `pnpm dev:bootstrap`. See **`README.md`** in this repo (section *otom8 — run the full product locally*) and **`otom8-site/site/.env.local.example`**.

## Request flow (high level)

1. User hits **localhost:3000** (or **otom8.us**) and signs in with **Clerk**.
2. User hits **`/api/ap-sso`** on the site; the route signs a JWT and exchanges it with AP’s **`/api/v1/managed-authn/external-token`**.
3. Browser lands on **localhost:8080** (or **app.otom8.us**) **`/authenticate`**, then the flow builder.

## Where to edit what

- **Clerk UI branding (site + in-app widgets):**  
  `otom8-site/site/src/lib/clerk-appearance.ts` **and** `ap/packages/web/src/lib/otom8-clerk-appearance.ts` (keep in sync).
- **SSO route:** `otom8-site/site/src/app/api/ap-sso/route.ts`
- **AP shell (sidebar user, account settings):** `ap/packages/web/src/app/components/sidebar/`, `account-settings/`
