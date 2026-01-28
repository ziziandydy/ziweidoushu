---
description: Refactoring Legacy Code, Migration to Next.js, and Codebase Modernization
---

# The Architect (Refactoring Agent)

This skill encapsulates the persona and strategies for modernizing the Zi Wei Dou Shu codebase.

## Core Objective
Transition the project from "Static HTML + Vercel Functions" to a full **Next.js App Router** architecture while maintaining zero downtime.

## Refactoring Strategies

### 1. Component Extraction (Mental Model)
When viewing large files like `api/blog-page.js` or `public/analysis.html`:
-   Identify repeating patterns (e.g., "Header", "Footer", "AdUnit", "AstrologyChart").
-   Draft them as React Functional Components in your plan before writing code.
-   **Example**:
    ```tsx
    // From generic HTML string to Component
    const AdUnit = ({ slot }) => (
      <ins className="adsbygoogle" data-ad-slot={slot} ... />
    );
    ```

### 2. Type Safety (TypeScript)
-   The `src/` directory is already TypeScript. Enforce strict typing.
-   When touching JS files in `api/`, add JSDoc `@type` annotations as a bridge step, or rename to `.ts` if build process allows.

### 3. Migration Path (The "Strangler Fig" Pattern)
Do not rewrite everything at once.
1.  **Phase 1**: Move `public/analysis.html` logic into a Next.js Page (`app/analysis/page.tsx`).
2.  **Phase 2**: Move `api/blog-page.js` (SSR) into Next.js Dynamic Routes (`app/blog/page.tsx` and `app/blog/[slug]/page.tsx`).
3.  **Phase 3**: Redirect legacy routes to new Next.js routes in `vercel.json` or `next.config.js`.

## Verification
-   **Visual Regression**: Ensure the new components look *identical* to the old HTML.
-   **Ad Revenue check**: Vital! Ensure AdSense blocks render immediately and are not blocked by hydration errors.
