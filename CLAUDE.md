# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual (zh-TW / en) Zi Wei Dou Shu (紫微斗數) site at https://aiziwei.online (`www` redirects to it): chart calculation following the 中州派 school, GPT-4o analysis and Q&A, ECPay payments, and a blog. It is deployed on Vercel; every push to `main` deploys to production.

## Goals

The site is run as an automated content platform: articles are published and teased on Facebook by workflows, with as little manual work as possible. Prefer changes that keep that pipeline unattended over ones that add a manual step.

Priorities, in order:

1. Organic traffic and AdSense revenue. SEO, AI-search visibility, page speed and AdSense policy compliance come first when they conflict with other work.
2. A portfolio piece that shows the owner's product ability to employers, so visible quality and polish matter.
3. Paid Q&A conversion is secondary.

The zh-TW and en editions are equally important. A change to content, copy, metadata or structured data covers both languages.

## Commands

```bash
npm run dev          # Next.js dev server
npm run build        # next build
npm run build:css    # Tailwind -> public/styles.css, then stamps a content hash into public/*.html
npm test             # jest with coverage (60% global threshold)
npx jest test/calendar.test.ts            # one test file
npx jest -t "name of the test"            # one test by name
npm run lint         # eslint over src/ and test/ only
npm run migrate      # database migrations, see scripts/migrations/ and docs/DATABASE_MIGRATION_GUIDE.md
```

`next.config.js` sets `typescript.ignoreBuildErrors`, so a passing `npm run build` does not mean the types are correct.

## Architecture

Three parts live in one repo and are wired together in ways that are not obvious from any single file.

**1. Calculation engine: `src/` (TypeScript) and `build/` (committed JavaScript).**
`api/calculate.js` loads `build/main.js`, not `src/`. `build/` is checked into git, `src/` is excluded from the deploy by `.vercelignore`, and `tsconfig.json` has `noEmit: true`, so `npm run build:ts` does not regenerate `build/`. A change to the engine in `src/` reaches production only when the matching file in `build/` is changed too. The jest tests in `test/` run against `src/`, so they can pass while `build/` is stale.

**2. Site: Next.js App Router in `app/`.**
All pages are under `app/[locale]/`, where `locale` is `zh-TW` or `en`; there is no middleware. Unprefixed URLs are sent to `/zh-TW/...` by redirects and rewrites that are split between `next.config.js` and `vercel.json`, so check both when adding a route. Blog pages read Postgres directly through `app/lib/blog.ts`; they do not call the blog API. The analysis page is a client component that calls `/api/calculate`, `/api/analyze` and `/api/question`. Styles come from `public/styles.css`, which is generated from `src/styles/input.css`; run `npm run build:css` after changing Tailwind classes or the input file.

**3. API: Vercel Serverless Functions in `api/` (CommonJS), not Next.js route handlers.**
They share helpers in the root `lib/` (CORS, errors, auth, locale detection, the 中州派 knowledge base in `lib/knowledge/`). `next dev` does not serve them: in development `next.config.js` proxies `/api/*` to the production site, so local changes to `api/` are not exercised by `npm run dev`. To test an API change, push a branch and use its Vercel Preview deployment.

The Vercel Hobby plan allows 12 functions. `api/` currently holds 10, which is why `api/page.js` serves several things at once (the admin HTML pages in `public/` and `sitemap.xml`) and `api/ecpay.js` multiplexes on `?action=create|callback|return`. Add behaviour to an existing function before adding a new file under `api/`.

**Static leftovers.** `public/admin-login.html`, `public/admin-dashboard.html` and the `payment-*.html` pages are plain HTML from before the Next.js migration. They use `public/js/i18n.js` and `locales/` for translations; the Next.js pages keep their strings in code (for example `app/[locale]/analysis/translations.ts`).

## Blog pipeline

Posts are stored in the Postgres table `blog_posts`, one row per language. They are written by n8n workflows through `api/blog/*` (Bearer JWT), not from this repo. `lib/titleCheck.js` rejects titles at the API, and `api/knowledge.js` exposes the knowledge base to the workflow. Workflow definitions and helpers are in `docs/n8n-weekly-blog-workflow.*` and `scripts/n8n/`. `content/rewrites/` holds rewritten article bodies that `scripts/apply-content-rewrites.js` applies to the database.

## Things to know

- `.env`, `.env.local`, `.env.n8n.local` and `.env.make.local` hold live credentials. `.env.example` lists the variables.
- `README.md` still lists `api/admin/` and `api/health.js`, which no longer exist.
- `webpack.config.js`, `vite.config.ts`, `api-server.js`, `run-tests.sh`, `simple-test.js` and the other root-level test scripts predate the Next.js migration and are not part of the current build or test flow.
- `docs/archive/` is historical; current plans are in `docs/` and `docs/superpowers/`.
