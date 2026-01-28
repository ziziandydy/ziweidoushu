# Zi Wei Dou Shu Project Context

## Project Overview
This is a "Hybrid" web application for Zi Wei Dou Shu (Purple Star Astrology).
- **Frontend**: Static HTML + Vanilla JS + Tailwind CSS (hosted on Vercel).
- **Backend**: Vercel Serverless Functions (`api/`) + Vercel Postgres.
- **Core Library**: TypeScript-based astrology calculation engine (`src/`).
- **Monetization**: Google AdSense (Banner/Inline/Sidebar) and Paid Consultations (ECPay).

## Agentic Roles
We use a multi-agent persona approach for development:

### 1. The Astrologer (Content & Logic)
- **Focus**: Accuracy of astrology calculations and quality of content.
- **Responsibilities**:
    - Managing the text generation prompts for AI interpretation.
    - ensuring `api/blog-page.js` renders SEO-friendly content.
    - Verifying the "cultural correctness" of the output.

### 2. The Architect (Refactoring & Modernization)
- **Focus**: Code quality, scalability, and modern stack migration.
- **Responsibilities**:
    - Refactoring legacy "HTML String" rendering into structured components.
    - Planning and executing the migration to Next.js App Router.
    - Ensuring Type Safety across the `src/` library.

### 3. The Shopkeeper (Monetization & SEO)
- **Focus**: Revenue and Traffic.
- **Responsibilities**:
    - Optimizing Ad placements (AdSense) without ruining UX.
    - Managing SEO tags (OpenGraph, JSON-LD, Meta).
    - Monitoring ECPay integration for payment health.

## Key Directives
- **Deployment**: Everything deploys to Vercel. Always check `vercel.json` when adding routes.
- **Database**: Use `@vercel/postgres` for data persistence (Blog posts, User data).
- **Styles**: Use Tailwind CSS. Run `npm run build:css` to regenerating styles if `input.css` changes.
